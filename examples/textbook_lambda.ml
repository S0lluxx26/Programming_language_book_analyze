(* Original 9.3 solutions. Capture-avoiding substitution and full normal order.
   translate uses the book's natural-number encoding. translate_signed adds
   integer pairs, so negative constants and nontruncated subtraction are possible. *)
type lambda = LVAR of string | LPROC of string*lambda | LCALL of lambda*lambda
type exp = CONST of int | VAR of string | ADD of exp*exp | SUB of exp*exp | MUL of exp*exp
  | ISZERO of exp | IF of exp*exp*exp | LET of string*exp*exp
  | LETREC of string*string*exp*exp | PROC of string*exp | CALL of exp*exp
let union a b = List.sort_uniq String.compare (a@b)
let rec fv = function
  | LVAR x -> [x] | LCALL(a,b) -> union (fv a) (fv b)
  | LPROC(x,b) -> List.filter ((<>) x) (fv b)
let rec names = function
  | LVAR x -> [x] | LCALL(a,b) -> union (names a) (names b)
  | LPROC(x,b) -> union [x] (names b)
let fresh used =
  let rec loop n = let x = "fresh"^string_of_int n in if List.mem x used then loop(n+1) else x in loop 0
let rec subst x replacement term = match term with
  | LVAR y -> if x=y then replacement else term
  | LCALL(a,b) -> LCALL(subst x replacement a,subst x replacement b)
  | LPROC(y,_) when x=y -> term
  | LPROC(y,b) ->
      if not(List.mem x (fv b)) then term
      else if List.mem y (fv replacement) then
        let z = fresh (union [x] (union (names b) (names replacement))) in
        LPROC(z,subst x replacement (subst y (LVAR z) b))
      else LPROC(y,subst x replacement b)
let rec step = function
  | LCALL(LPROC(x,b),a) -> Some(subst x a b)
  | LCALL(f,a) -> (match step f with Some f' -> Some(LCALL(f',a))
      | None -> Option.map (fun a' -> LCALL(f,a')) (step a))
  | LPROC(x,b) -> Option.map (fun b' -> LPROC(x,b')) (step b)
  | LVAR _ -> None
let rec reduce term = match step term with None -> term | Some next -> reduce next
exception Step_limit
let reduce_bounded fuel term =
  let rec loop fuel t = match step t with
    | None -> t | Some _ when fuel=0 -> raise Step_limit
    | Some t -> loop (fuel-1) t in loop fuel term
let v x = LVAR x
let app f x = LCALL(f,x)
let apps f xs = List.fold_left app f xs
let lam xs body = List.fold_right (fun x b -> LPROC(x,b)) xs body
let true_ = lam ["t";"f"] (v "t")
let false_ = lam ["t";"f"] (v "f")
let numeral n =
  if n<0 then invalid_arg "natural encoding requires nonnegative constants";
  let rec body n = if n=0 then v "z" else app (v "s") (body(n-1)) in lam ["s";"z"] (body n)
let plus = lam ["n";"m";"s";"z"] (apps (v "m") [v "s";apps (v "n") [v "s";v "z"]])
let times = lam ["n";"m";"s";"z"] (apps (v "n") [app (v "m") (v "s");v "z"])
let pred = lam ["n";"f";"x"] (apps (v "n") [
  lam ["g";"h"] (app (v "h") (app (v "g") (v "f")));
  lam ["u"] (v "x"); lam ["u"] (v "u")])
let minus = lam ["n";"m"] (apps (v "m") [pred;v "n"])
let iszero = lam ["n"] (apps (v "n") [lam ["u"] false_;true_])
let fix = lam ["f"] (let g = lam ["x"] (app (v "f") (app (v "x") (v "x"))) in app g g)
let pair a b = lam ["choose"] (apps (v "choose") [a;b])
(* pair is used only for closed numeral/operator bodies, where choose is fresh. *)
let first p = app p true_
let second p = app p false_
let signed_plus = lam ["a";"b"] (pair
  (apps plus [first(v "a");first(v "b")])
  (apps plus [second(v "a");second(v "b")]))
let signed_minus = lam ["a";"b"] (pair
  (apps plus [first(v "a");second(v "b")])
  (apps plus [second(v "a");first(v "b")]))
let signed_times =
  let a = first(v "a") and b = second(v "a") and c = first(v "b") and d = second(v "b") in
  lam ["a";"b"] (pair
    (apps plus [apps times [a;c];apps times [b;d]])
    (apps plus [apps times [a;d];apps times [b;c]]))
let signed_zero = lam ["p"] (
  let a = first(v "p") and b = second(v "p") in
  apps (app iszero (apps minus [a;b])) [app iszero (apps minus [b;a]);false_])
let translate_with signed e =
  let rec trans = function
    | CONST n -> if signed then (
        if n=min_int then invalid_arg "min_int magnitude exceeds host int";
        if n>=0 then pair (numeral n) (numeral 0) else pair (numeral 0) (numeral (-n))) else numeral n
    | VAR x -> v x
    | ADD(a,b) -> apps (if signed then signed_plus else plus) [trans a;trans b]
    | SUB(a,b) -> apps (if signed then signed_minus else minus) [trans a;trans b]
    | MUL(a,b) -> apps (if signed then signed_times else times) [trans a;trans b]
    | ISZERO a -> app (if signed then signed_zero else iszero) (trans a)
    | IF(c,a,b) -> apps (trans c) [trans a;trans b]
    | LET(x,a,b) -> app (lam [x] (trans b)) (trans a)
    | PROC(x,b) -> lam [x] (trans b)
    | CALL(f,a) -> app (trans f) (trans a)
    | LETREC(f,x,b,inside) -> app (lam [f] (trans inside)) (app fix (lam [f;x] (trans b))) in trans e
let translate = translate_with false
let translate_signed = translate_with true
let decode term = match reduce_bounded 200000 term with
  | LPROC(s,LPROC(z,b)) ->
      let rec count = function
        | LVAR x when x=z -> 0
        | LCALL(LVAR x,b) when x=s -> 1+count b
        | _ -> failwith "not a Church numeral" in count b
  | _ -> failwith "not a Church numeral"
let decode_signed term = decode(first term)-decode(second term)
let checks = ref 0
let check label ok = incr checks; if not ok then failwith label
let () =
  check "avoid capture" (match reduce(app (lam ["x";"y"] (app (v "x") (v "y"))) (v "y")) with
    | LPROC(z,LCALL(LVAR "y",LVAR z')) -> z=z' && z<>"y" | _ -> false);
  check "shadowing" (reduce(app (lam ["x";"x"] (v "x")) (v "y")) = lam ["x"] (v "x"));
  check "reduce under lambda" (reduce(lam ["z"] (app (lam ["x"] (v "x")) (v "z"))) = lam ["z"] (v "z"));
  let self = lam ["x"] (app (v "x") (v "x")) in let omega = app self self in
  check "normal order ignores unused divergent argument" (reduce(app (lam ["unused"] (v "answer")) omega) = v "answer");
  check "bounded divergence guard" (try ignore(reduce_bounded 10 omega); false with Step_limit -> true);
  check "book sum" (decode(translate(ADD(CONST 1,CONST 2)))=3);
  check "multiply" (decode(translate(MUL(CONST 2,CONST 3)))=6);
  check "natural subtraction" (decode(translate(SUB(CONST 3,CONST 1)))=2 && decode(translate(SUB(CONST 1,CONST 3)))=0);
  check "if zero" (decode(translate(IF(ISZERO(CONST 0),CONST 7,CONST 8)))=7);
  check "if nonzero" (decode(translate(IF(ISZERO(CONST 2),CONST 7,CONST 8)))=8);
  check "let and call" (decode(translate(LET("f",PROC("x",ADD(VAR "x",CONST 1)),CALL(VAR "f",CONST 2))))=3);
  let factorial = LETREC("f","n",IF(ISZERO(VAR "n"),CONST 1,
    MUL(VAR "n",CALL(VAR "f",SUB(VAR "n",CONST 1)))),CALL(VAR "f",CONST 3)) in
  check "Y recursion" (decode(translate factorial)=6);
  check "signed negative" (decode_signed(translate_signed(CONST (-2))) = -2);
  check "signed subtraction" (decode_signed(translate_signed(SUB(CONST 1,CONST 3))) = -2);
  check "signed multiply" (decode_signed(translate_signed(MUL(CONST (-2),CONST 3))) = -6);
  check "signed zero after cancellation" (decode_signed(translate_signed(IF(ISZERO(ADD(CONST (-2),CONST 2)),CONST 9,CONST 8))) = 9);
  Printf.printf "Textbook chapter 9: %d checks passed.\n" !checks
