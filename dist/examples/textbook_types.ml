(* Original 8.8 solutions: equation generation, unification, and a monomorphic
   Fun extension. Equality has two alternatives: int/int or bool/bool. *)
type exp = UNIT | TRUE | FALSE | CONST of int | VAR of string
  | ADD of exp*exp | SUB of exp*exp | MUL of exp*exp | DIV of exp*exp
  | ISZERO of exp | EQUAL of exp*exp | LESS of exp*exp | NOT of exp
  | NIL | CONS of exp*exp | APPEND of exp*exp | HEAD of exp | TAIL of exp | ISNIL of exp
  | IF of exp*exp*exp | LET of string*exp*exp | PROC of string*exp | CALL of exp*exp
  | LETREC of string*string*exp*exp
  | LETMREC of (string*string*exp)*(string*string*exp)*exp
  | PRINT of exp | SEQ of exp*exp
type typ = TyInt | TyBool | TyUnit | TyFun of typ*typ | TyList of typ | TyVar of string
type subst = (string*typ) list
exception Type_error of string
let error s = raise(Type_error s)
let count = ref 0
let fresh () = incr count; TyVar ("t"^string_of_int !count)
let rec apply s = function
  | TyVar x as t -> (match List.assoc_opt x s with None -> t | Some u -> apply s u)
  | TyFun(a,b) -> TyFun(apply s a,apply s b)
  | TyList a -> TyList(apply s a) | t -> t
let rec occurs x = function
  | TyVar y -> x=y | TyFun(a,b) -> occurs x a || occurs x b
  | TyList a -> occurs x a | _ -> false
let solve equations =
  let rec loop s = function
    | [] -> s
    | (a,b)::rest -> let a = apply s a in let b = apply s b in
        if a=b then loop s rest else match a,b with
        | TyVar x,t | t,TyVar x ->
            if occurs x t then error "occurs check";
            let one = [x,t] in
            loop ((x,t)::List.map (fun (y,u) -> y,apply one u) s) rest
        | TyFun(a,b),TyFun(c,d) -> loop s ((a,c)::(b,d)::rest)
        | TyList a,TyList b -> loop s ((a,b)::rest)
        | _ -> error "incompatible type constructors" in loop [] equations
(* Internal result is equations plus scalar-equality restrictions. *)
let rec generate env e expected =
  let combine pairs = List.fold_left (fun (eqs,scalars) (e,t) ->
    let more,s = generate env e t in eqs@more,scalars@s) ([],[]) pairs in
  let with_eq extra (eqs,scalars) = extra@eqs,scalars in
  let binary result a b = with_eq [expected,result] (combine [a,TyInt;b,TyInt]) in
  match e with
  | CONST _ -> [expected,TyInt],[] | TRUE | FALSE -> [expected,TyBool],[]
  | UNIT -> [expected,TyUnit],[]
  | VAR x -> (match List.assoc_opt x env with Some t -> [expected,t],[] | None -> error("unbound: "^x))
  | ADD(a,b) | SUB(a,b) | MUL(a,b) | DIV(a,b) -> binary TyInt a b
  | LESS(a,b) -> binary TyBool a b
  | ISZERO a -> with_eq [expected,TyBool] (combine [a,TyInt])
  | NOT a -> with_eq [expected,TyBool] (combine [a,TyBool])
  | EQUAL(a,b) -> let t = fresh() in let eqs,scalars = combine [a,t;b,t] in
      (expected,TyBool)::eqs,t::scalars
  | NIL -> [expected,TyList(fresh())],[]
  | CONS(a,b) -> let t = fresh() in with_eq [expected,TyList t] (combine [a,t;b,TyList t])
  | APPEND(a,b) -> let t = TyList(fresh()) in with_eq [expected,t] (combine [a,t;b,t])
  | HEAD a -> combine [a,TyList expected]
  | TAIL a -> let t = TyList(fresh()) in with_eq [expected,t] (combine [a,t])
  | ISNIL a -> with_eq [expected,TyBool] (combine [a,TyList(fresh())])
  | IF(c,a,b) -> combine [c,TyBool;a,expected;b,expected]
  | LET(x,a,b) -> let t = fresh() in let eq1,s1 = generate env a t in
      let eq2,s2 = generate ((x,t)::env) b expected in eq1@eq2,s1@s2
  | PROC(x,b) -> let a = fresh() in let r = fresh() in
      with_eq [expected,TyFun(a,r)] (generate ((x,a)::env) b r)
  | CALL(f,a) -> let t = fresh() in combine [f,TyFun(t,expected);a,t]
  | LETREC(f,x,b,inside) -> let a = fresh() in let r = fresh() in
      let env' = (f,TyFun(a,r))::env in
      let eq1,s1 = generate ((x,a)::env') b r in
      let eq2,s2 = generate env' inside expected in eq1@eq2,s1@s2
  | LETMREC((f,x,b),(g,y,c),inside) ->
      if f=g then error "mutual function names must differ";
      let a = fresh() in let r = fresh() in let u = fresh() in let v = fresh() in
      let env' = (f,TyFun(a,r))::(g,TyFun(u,v))::env in
      let q1,s1 = generate ((x,a)::env') b r in
      let q2,s2 = generate ((y,u)::env') c v in
      let q3,s3 = generate env' inside expected in q1@q2@q3,s1@s2@s3
  | PRINT a -> let q,s = combine [a,fresh()] in (expected,TyUnit)::q,s
  | SEQ(a,b) -> combine [a,fresh();b,expected]
let gen_equations env e expected =
  let equations,scalars = generate env e expected in
  if scalars<>[] then error "use infer_fun for the equality extension"; equations
let typecheck e = count:=0; let t = fresh() in apply (solve (gen_equations [] e t)) t
(* Enumerate valid scalar choices, prune inconsistent choices with unification.
   This is exponential in the number of unresolved equalities: a clear teaching
   implementation, not a production constraint solver. No host polymorphic (=). *)
let infer_fun e =
  count:=0; let t = fresh() in let equations,scalars = generate [] e t in
  let rec alternatives eqs = function
    | [] -> (try [apply (solve eqs) t] with Type_error _ -> [])
    | a::rest -> List.concat (List.map (fun candidate ->
        let next = (a,candidate)::eqs in
        try ignore(solve next); alternatives next rest with Type_error _ -> []) [TyInt;TyBool]) in
  let results = List.sort_uniq compare (alternatives equations scalars) in
  if results=[] then error "no consistent typing" else results
let checks = ref 0
let check label ok = incr checks; if not ok then failwith label
let fails f = try ignore(f()); false with Type_error _ -> true
let () =
  check "arithmetic" (typecheck (ADD(CONST 1,CONST 2)) = TyInt);
  check "application" (typecheck (CALL(PROC("x",ADD(VAR "x",CONST 1)),CONST 4)) = TyInt);
  check "identity" (match typecheck(PROC("x",VAR "x")) with TyFun(a,b) -> a=b | _ -> false);
  check "if branch mismatch" (fails(fun () -> typecheck(IF(ISZERO(CONST 0),CONST 1,ISZERO(CONST 1)))));
  check "unbound" (fails(fun () -> typecheck(VAR "missing")));
  check "occurs check self application" (fails(fun () -> typecheck(PROC("x",CALL(VAR "x",VAR "x")))));
  let s = solve [TyVar "a",TyVar "b"; TyVar "b",TyInt] in
  check "transitive substitution" (apply s (TyVar "a") = TyInt);
  check "function decomposition" (apply (solve [TyFun(TyVar "a",TyVar "b"),TyFun(TyInt,TyVar "a")]) (TyVar "b") = TyInt);
  check "list" (infer_fun(CONS(CONST 1,NIL)) = [TyList TyInt]);
  check "head" (infer_fun(HEAD(CONS(TRUE,NIL))) = [TyBool]);
  check "empty head has shape type" (match infer_fun(HEAD NIL) with [TyVar _] -> true | _ -> false);
  check "mixed list rejected" (fails(fun () -> infer_fun(CONS(CONST 1,CONS(TRUE,NIL)))));
  check "scalar equality int" (infer_fun(EQUAL(CONST 1,CONST 2)) = [TyBool]);
  check "scalar equality bool" (infer_fun(EQUAL(TRUE,FALSE)) = [TyBool]);
  check "list equality rejected" (fails(fun () -> infer_fun(EQUAL(NIL,NIL))));
  let possible = infer_fun(PROC("x",EQUAL(VAR "x",VAR "x"))) in
  check "two equality function types" (List.length possible=2 && List.mem (TyFun(TyInt,TyBool)) possible && List.mem (TyFun(TyBool,TyBool)) possible);
  let even = "even","n",IF(EQUAL(VAR "n",CONST 0),TRUE,CALL(VAR "odd",SUB(VAR "n",CONST 1))) in
  let odd = "odd","n",IF(EQUAL(VAR "n",CONST 0),FALSE,CALL(VAR "even",SUB(VAR "n",CONST 1))) in
  check "mutual recursion" (infer_fun(LETMREC(even,odd,CALL(VAR "odd",CONST 3))) = [TyBool]);
  check "print sequence" (infer_fun(SEQ(PRINT(CONST 1),UNIT)) = [TyUnit]);
  check "monomorphic let deliberately rejects mixed uses" (fails(fun () -> infer_fun(
    LET("id",PROC("x",VAR "x"),SEQ(CALL(VAR "id",CONST 1),CALL(VAR "id",TRUE))))));
  Printf.printf "Textbook chapter 8: %d checks passed.\n" !checks
