(* Original solutions to 6.3 and 7.4. One engine, two explicitly separate modes.
   Immutable finite stores allow enumeration for mark-and-sweep. *)
type exp = CONST of int | VAR of string
  | ADD of exp*exp | SUB of exp*exp | MUL of exp*exp | DIV of exp*exp
  | ISZERO of exp | IF of exp*exp*exp | LET of string*exp*exp
  | LETREC of string*string*exp*exp | PROC of string*exp | CALL of exp*exp
  | CALLREF of exp*string | SET of string*exp | SEQ of exp*exp
  | NEWREF of exp | DEREF of exp | SETREF of exp*exp
  | EMPTYREC | REC of string*exp*string*exp | FIELD of exp*string
  | FIELDASSIGN of exp*string*exp | NEW of exp | ADDROF of string | STORE of exp*exp
type value = Int of int | Bool of bool | Loc of int | Record of (string*int) list
  | Closure of string*exp*env | RecClosure of string*string*exp*env
and binding = Value of value | Address of int
and env = (string*binding) list
type mem = { next:int; cells:(int*value) list }
type mode = Explicit | Implicit
exception Runtime_error of string
let error s = raise(Runtime_error s)
let empty = {next=0;cells=[]}
let find x xs = try List.assoc x xs with Not_found -> error "missing name, field, or address"
let read l m = find l m.cells
let write l v m = ignore(read l m); {m with cells=(l,v)::List.remove_assoc l m.cells}
let alloc v m = m.next,{next=m.next+1;cells=(m.next,v)::m.cells}
let integer = function Int n -> n | _ -> error "expected integer"
let boolean = function Bool b -> b | _ -> error "expected boolean"
let location = function Loc l -> l | _ -> error "expected pointer"
let field x = function Record fs -> find x fs | _ -> error "expected record"
let address x env = match find x env with Address l -> l | Value _ -> error "expected variable cell"
let value x env m = match find x env with Value v -> v | Address l -> read l m
let bind mode x v env m = match mode with
  | Explicit -> (x,Value v)::env,m
  | Implicit -> let l,m = alloc v m in (x,Address l)::env,m
(* Collect every reachable pointer, field cell, and captured-environment cell.
   Mark before following outgoing edges, so self-cycles terminate. *)
let rec value_roots = function
  | Loc l -> [l] | Record fields -> List.map snd fields
  | Closure(_,_,env) | RecClosure(_,_,_,env) -> env_roots env
  | Int _ | Bool _ -> []
and env_roots env = List.concat (List.map (function
  | _,Address l -> [l] | _,Value v -> value_roots v) env)
let gc env mem =
  let rec mark seen = function
    | [] -> seen
    | l::rest when List.mem l seen -> mark seen rest
    | l::rest -> mark (l::seen) (value_roots (read l mem) @ rest) in
  let live = mark [] (env_roots env) in
  {mem with cells=List.filter (fun (l,_) -> List.mem l live) mem.cells}
let eval ?(collect=false) mode expression env mem =
  let rec go tail e env mem =
    (* Only when NO surrounding work remains; not merely a local syntactic tail. *)
    let mem = if collect && tail then gc env mem else mem in
    let bin op a b =
      let x,m1 = go false a env mem in
      let y,m2 = go false b env m1 in op (integer x) (integer y),m2 in
    match e with
    | CONST n -> Int n,mem | VAR x -> value x env mem,mem
    | ADD(a,b) -> bin (fun x y -> Int(x+y)) a b
    | SUB(a,b) -> bin (fun x y -> Int(x-y)) a b
    | MUL(a,b) -> bin (fun x y -> Int(x*y)) a b
    | DIV(a,b) -> bin (fun x y -> if y=0 then error "division by zero" else Int(x/y)) a b
    | ISZERO a -> let v,m = go false a env mem in Bool(integer v=0),m
    | IF(c,t,f) -> let v,m = go false c env mem in go tail (if boolean v then t else f) env m
    | LET(x,a,b) -> let v,m = go false a env mem in let env,m = bind mode x v env m in go tail b env m
    | PROC(x,b) -> Closure(x,b,env),mem
    | LETREC(f,x,b,inside) ->
        (match mode with
         | Explicit -> go tail inside ((f,Value(RecClosure(f,x,b,env)))::env) mem
         | Implicit -> let l,m = alloc (Int 0) mem in
             let env' = (f,Address l)::env in
             let m = write l (Closure(x,b,env')) m in go tail inside env' m)
    | CALL(f,a) -> let vf,m1 = go false f env mem in let va,m2 = go false a env m1 in
        call tail vf (fun x saved m -> bind mode x va saved m) m2
    | CALLREF(f,x) ->
        if mode <> Implicit then error "CALLREF belongs to implicit references";
        let vf,m = go false f env mem in let l = address x env in
        call tail vf (fun formal saved m -> (formal,Address l)::saved,m) m
    | SET(x,a) -> let v,m = go false a env mem in v,write (address x env) v m
    | SEQ(a,b) -> let _,m = go false a env mem in go tail b env m
    | NEWREF a | NEW a -> let v,m = go false a env mem in let l,m = alloc v m in Loc l,m
    | ADDROF x -> Loc(address x env),mem
    | DEREF a -> let v,m = go false a env mem in read (location v) m,m
    | SETREF(a,b) | STORE(a,b) -> let ptr,m1 = go false a env mem in
        let v,m2 = go false b env m1 in v,write (location ptr) v m2
    | EMPTYREC -> Record [],mem
    | REC(x,a,y,b) ->
        if x=y then error "record field names must differ";
        let va,m1 = go false a env mem in let vb,m2 = go false b env m1 in
        let lx,m3 = alloc va m2 in let ly,m4 = alloc vb m3 in Record[x,lx;y,ly],m4
    | FIELD(a,x) -> let r,m = go false a env mem in read (field x r) m,m
    | FIELDASSIGN(a,x,b) -> let r,m1 = go false a env mem in
        let v,m2 = go false b env m1 in v,write (field x r) v m2
  and call tail vf argument mem = match vf with
    | Closure(x,b,saved) -> let env,m = argument x saved mem in go tail b env m
    | RecClosure(f,x,b,saved) ->
        let env,m = argument x ((f,Value vf)::saved) mem in go tail b env m
    | _ -> error "called non-procedure" in
  go true expression env mem
let run ?(collect=false) mode e = fst (eval ~collect mode e [] empty)
(* Adapter for the printed 7.4 signature, which returns only the final memory. *)
let eval_memory e env mem = snd(eval Implicit e env mem)
let checks = ref 0
let check name ok = incr checks; if not ok then failwith name
let () =
  let nested = NEWREF(NEWREF(CONST 0)) in
  let outer,m = eval Explicit nested [] empty in
  let outer_l = location outer in
  let inner_l = location (read outer_l m) in
  check "nested allocation keeps distinct cells" (outer_l <> inner_l && List.length m.cells=2 && read inner_l m=Int 0);
  check "nested dereference" (run Explicit (DEREF(DEREF nested))=Int 0);
  let counter = LET("p",NEWREF(CONST 0),LET("f",PROC("u",SEQ(
    SETREF(VAR "p",ADD(DEREF(VAR "p"),CONST 1)),DEREF(VAR "p"))),
    ADD(CALL(VAR "f",CONST 0),CALL(VAR "f",CONST 0)))) in
  check "explicit state threaded left to right" (run Explicit counter = Int 3);
  let parameter refcall = LET("a",CONST 1,LET("f",PROC("x",SET("x",CONST 9)),
    SEQ((if refcall then CALLREF(VAR "f","a") else CALL(VAR "f",VAR "a")),VAR "a"))) in
  check "value parameter cell" (run Implicit (parameter false) = Int 1);
  check "reference aliases caller cell" (run Implicit (parameter true) = Int 9);
  let sharing = LET("a",REC("v",CONST 1,"w",CONST 2),LET("b",VAR "a",
    SEQ(FIELDASSIGN(VAR "b","v",CONST 8),FIELD(VAR "a","v")))) in
  check "record aliases" (run Implicit sharing = Int 8);
  let pointer = LET("x",CONST 1,LET("p",ADDROF "x",SEQ(STORE(VAR "p",CONST 7),VAR "x"))) in
  check "pointer store" (run Implicit pointer = Int 7);
  let returning = LET("f",PROC("x",ADDROF "x"),LET("p",CALL(VAR "f",CONST 4),DEREF(VAR "p"))) in
  check "escaping address survives return" (run Implicit returning = Int 4);
  List.iter (fun e -> check "GC preserves result" (run ~collect:true Implicit e = run Implicit e))
    [parameter true;parameter false;sharing;pointer;returning];
  let factorial = LETREC("f","n",IF(ISZERO(VAR "n"),CONST 1,
    MUL(VAR "n",CALL(VAR "f",SUB(VAR "n",CONST 1)))),CALL(VAR "f",CONST 5)) in
  check "explicit recursion" (run Explicit factorial = Int 120);
  check "implicit recursion with GC" (run ~collect:true Implicit factorial = Int 120);
  let m = {next=4;cells=[0,Loc 1;1,Loc 0;2,Int 99;3,Int 10]} in
  let live = gc ["root",Address 0] m in
  check "cycle marking and sweep" (List.map fst live.cells = [0;1] && live.next=4);
  let m = {next=3;cells=[0,Closure("x",VAR "hidden",["hidden",Address 1]);1,Int 8;2,Int 9]} in
  check "closure captured root" (List.map fst (gc ["f",Address 0] m).cells = [0;1]);
  (* The caller still needs p while evaluating f: collecting in f with only its
     environment would incorrectly free p. The global-tail flag prevents this. *)
  let pending = LET("f",PROC("x",CONST 5),LET("p",NEW(CONST 7),ADD(CALL(VAR "f",CONST 0),DEREF(VAR "p")))) in
  check "caller continuation roots protected" (run ~collect:true Implicit pending = Int 12);
  check "division and zero" (run Implicit (IF(ISZERO(CONST 0),DIV(CONST 8,CONST 2),CONST 0)) = Int 4);
  check "bad pointer rejected" (try ignore(run Implicit (DEREF(CONST 1))); false with Runtime_error _ -> true);
  Printf.printf "Textbook chapters 6-7: %d checks passed.\n" !checks
