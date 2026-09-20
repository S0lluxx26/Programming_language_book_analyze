(* Original complete evaluator for textbook chapters 3, 4, and 5.
   Chapter 3 uses the basic subset. Chapter 4 adds PROC/CALL/LETREC.
   Chapter 5 uses the whole syntax. Static scope is the default. *)
type exp = UNIT | TRUE | FALSE | CONST of int | VAR of string
  | ADD of exp*exp | SUB of exp*exp | MUL of exp*exp | DIV of exp*exp
  | EQUAL of exp*exp | LESS of exp*exp | NOT of exp
  | NIL | CONS of exp*exp | APPEND of exp*exp | HEAD of exp | TAIL of exp | ISNIL of exp
  | IF of exp*exp*exp | LET of string*exp*exp
  | LETREC of string*string*exp*exp
  | LETMREC of (string*string*exp)*(string*string*exp)*exp
  | PROC of string*exp | CALL of exp*exp | PRINT of exp | SEQ of exp*exp
type value = Unit | Int of int | Bool of bool | List of value list
  | Procedure of string*exp*env
  | RecProcedure of string*string*exp*env
  | MRecProcedure of string*string*exp*string*string*exp*env
and env = (string*value) list
type scope = Static | Dynamic
exception Runtime_error of string
let error s = raise (Runtime_error s)
let lookup x env = try List.assoc x env with Not_found -> error ("unbound: "^x)
let integer = function Int n -> n | _ -> error "expected integer"
let boolean = function Bool b -> b | _ -> error "expected boolean"
let list = function List xs -> xs | _ -> error "expected list"
let rec display = function
  | Unit -> "()" | Int n -> string_of_int n | Bool b -> string_of_bool b
  | List vs -> "[" ^ String.concat "; " (List.map display vs) ^ "]"
  | Procedure _ | RecProcedure _ | MRecProcedure _ -> "<procedure>"
let rec eval ?(scope=Static) ?(emit=print_endline) e env =
  let go e env = eval ~scope ~emit e env in
  let bin f a b = let a = integer (go a env) in let b = integer (go b env) in f a b in
  match e with
  | UNIT -> Unit | TRUE -> Bool true | FALSE -> Bool false | CONST n -> Int n
  | VAR x -> lookup x env
  | ADD(a,b) -> bin (fun x y -> Int(x+y)) a b
  | SUB(a,b) -> bin (fun x y -> Int(x-y)) a b
  | MUL(a,b) -> bin (fun x y -> Int(x*y)) a b
  | DIV(a,b) -> bin (fun x y -> if y=0 then error "division by zero" else Int(x/y)) a b
  | LESS(a,b) -> bin (fun x y -> Bool(x<y)) a b
  | EQUAL(a,b) -> let x = go a env in let y = go b env in
      (match x,y with Int x,Int y -> Bool(x=y) | Bool x,Bool y -> Bool(x=y)
       | _ -> error "equality requires two integers or two booleans")
  | NOT a -> Bool(not (boolean (go a env)))
  | NIL -> List []
  | CONS(a,b) -> let x = go a env in let xs = list (go b env) in List(x::xs)
  | APPEND(a,b) -> let xs = list (go a env) in let ys = list (go b env) in List(xs@ys)
  | HEAD a -> (match list (go a env) with x::_ -> x | [] -> error "head of empty list")
  | TAIL a -> (match list (go a env) with _::xs -> List xs | [] -> error "tail of empty list")
  | ISNIL a -> Bool(list (go a env) = [])
  | IF(c,t,f) -> if boolean (go c env) then go t env else go f env
  | LET(x,a,b) -> let v = go a env in go b ((x,v)::env)
  | PROC(x,b) -> Procedure(x,b,env)
  | LETREC(f,x,b,inside) -> go inside ((f,RecProcedure(f,x,b,env))::env)
  | LETMREC((f,x,b),(g,y,c),inside) ->
      if f=g then error "mutual function names must differ";
      let vf = MRecProcedure(f,x,b,g,y,c,env) in
      let vg = MRecProcedure(g,y,c,f,x,b,env) in go inside ((f,vf)::(g,vg)::env)
  | CALL(f,a) ->
      let closure = go f env in let arg = go a env in
      let base saved = match scope with Static -> saved | Dynamic -> env in
      (match closure with
       | Procedure(x,b,saved) -> go b ((x,arg)::base saved)
       | RecProcedure(f,x,b,saved) -> go b ((x,arg)::(f,closure)::base saved)
       | MRecProcedure(f,x,b,g,y,c,saved) ->
           let other = MRecProcedure(g,y,c,f,x,b,saved) in
           go b ((x,arg)::(f,closure)::(g,other)::base saved)
       | _ -> error "called a non-procedure")
  | PRINT e -> let v = go e env in emit (display v); Unit
  | SEQ(a,b) -> ignore (go a env); go b env
let run e = eval e []
let checks = ref 0
let check name ok = incr checks; if not ok then failwith name
let fails e = try ignore(run e); false with Runtime_error _ -> true
let () =
  check "basic let" (run (LET("x",CONST 1,ADD(VAR "x",CONST 2))) = Int 3);
  check "shadowing RHS uses old env" (run (LET("x",CONST 2,LET("x",ADD(VAR "x",CONST 3),VAR "x"))) = Int 5);
  let scope_test = LET("x",CONST 1,LET("f",PROC("y",ADD(VAR "x",VAR "y")),
    LET("x",CONST 2,LET("g",PROC("y",ADD(VAR "x",VAR "y")),ADD(CALL(VAR "f",CONST 1),CALL(VAR "g",CONST 1)))))) in
  check "static scope" (run scope_test = Int 5);
  check "dynamic scope" (eval ~scope:Dynamic scope_test [] = Int 6);
  let factorial = LETREC("f","n",IF(EQUAL(VAR "n",CONST 0),CONST 1,
    MUL(VAR "n",CALL(VAR "f",SUB(VAR "n",CONST 1)))),CALL(VAR "f",CONST 5)) in
  check "recursive closure" (run factorial = Int 120);
  check "dynamic recursion" (eval ~scope:Dynamic factorial [] = Int 120);
  let even = "even","n",IF(EQUAL(VAR "n",CONST 0),TRUE,CALL(VAR "odd",SUB(VAR "n",CONST 1))) in
  let odd = "odd","n",IF(EQUAL(VAR "n",CONST 0),FALSE,CALL(VAR "even",SUB(VAR "n",CONST 1))) in
  check "mutual even" (run (LETMREC(even,odd,CALL(VAR "even",CONST 8))) = Bool true);
  check "mutual odd" (run (LETMREC(even,odd,CALL(VAR "odd",CONST 8))) = Bool false);
  let xs = CONS(CONST 1,CONS(CONST 2,CONS(CONST 3,NIL))) in
  let rev = LETREC("rev","l",IF(ISNIL(VAR "l"),NIL,
      APPEND(CALL(VAR "rev",TAIL(VAR "l")),CONS(HEAD(VAR "l"),NIL))),CALL(VAR "rev",xs)) in
  check "recursive reverse" (run rev = List [Int 3;Int 2;Int 1]);
  check "division" (run (DIV(CONST 7,CONST 2)) = Int 3);
  check "less / not" (run (NOT(LESS(CONST 3,CONST 2))) = Bool true);
  check "boolean equality" (run (EQUAL(TRUE,FALSE)) = Bool false);
  check "unchosen branch" (run (IF(TRUE,CONST 9,DIV(CONST 1,CONST 0))) = Int 9);
  check "undefined operations" (List.for_all fails [VAR "missing";HEAD NIL;TAIL NIL;ADD(TRUE,CONST 1);DIV(CONST 1,CONST 0);CALL(CONST 0,CONST 1);EQUAL(NIL,NIL)]);
  let output = ref [] in
  check "print returns unit" (eval ~emit:(fun s -> output:=s::!output) (PRINT(CONST 3)) [] = Unit);
  ignore(eval ~emit:(fun s -> output:=s::!output) (SEQ(PRINT(CONST 4),PRINT(CONST 5))) []);
  check "print order" (List.rev !output = ["3";"4";"5"]);
  Printf.printf "Textbook chapters 3-5: %d checks passed.\n" !checks
