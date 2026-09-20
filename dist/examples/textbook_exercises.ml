(* Original worked solutions to English textbook section 2.4. OCaml 4.14.1. *)
let rec range n m =
  if n > m then [] else if n = m then [m] else n :: range (n + 1) m
let concat xs = List.fold_right (@) xs []
let rec zipper xs ys = match xs, ys with
  | [], rest | rest, [] -> rest
  | x::xt, y::yt -> x :: y :: zipper xt yt
let rec unzip = function
  | [] -> [], []
  | (x,y)::rest -> let xs,ys = unzip rest in x::xs, y::ys
let rec drop xs n =
  if n <= 0 then xs else match xs with [] -> [] | _::rest -> drop rest (n-1)
let rec sigma f a b =
  if a > b then 0 else if a = b then f a else f a + sigma f (a+1) b
let iter (n,f) =
  if n < 0 then invalid_arg "iter: negative count";
  let rec apply n x = if n = 0 then x else apply (n-1) (f x) in apply n
let all p xs = List.fold_right (fun x rest -> p x && rest) xs true
let lst2int xs = List.fold_left (fun acc digit -> 10*acc+digit) 0 xs
let length_r xs = List.fold_right (fun _ n -> n+1) xs 0
let length_l xs = List.fold_left (fun n _ -> n+1) 0 xs
let reverse_r xs = List.fold_right (fun x rest -> rest @ [x]) xs []
let reverse_l xs = List.fold_left (fun rest x -> x::rest) [] xs
let positive_r xs = List.fold_right (fun x rest -> x > 0 && rest) xs true
let positive_l xs = List.fold_left (fun rest x -> rest && x > 0) true xs
let map_r f xs = List.fold_right (fun x rest -> f x::rest) xs []
let map_l f xs = List.rev (List.fold_left (fun rest x -> f x::rest) [] xs)
let filter_r p xs = List.fold_right (fun x rest -> if p x then x::rest else rest) xs []
let filter_l p xs = List.rev (List.fold_left (fun rest x -> if p x then x::rest else rest) [] xs)
type nat = ZERO | SUCC of nat
let rec natadd a b = match a with ZERO -> b | SUCC a' -> SUCC (natadd a' b)
let rec natmul a b = match a with ZERO -> ZERO | SUCC a' -> natadd b (natmul a' b)
type aexp = Const of int | Var of string | Power of string * int
          | Times of aexp list | Sum of aexp list
(* Smart constructors remove neutral terms; they do not reorder arbitrary expressions. *)
let sum terms =
  let terms = List.filter (function Const 0 -> false | _ -> true) terms in
  match terms with [] -> Const 0 | [x] -> x | _ -> Sum terms
let product terms =
  if List.exists (function Const 0 -> true | _ -> false) terms then Const 0
  else let terms = List.filter (function Const 1 -> false | _ -> true) terms in
    match terms with [] -> Const 1 | [x] -> x | _ -> Times terms
let power x n = if n = 0 then Const 1 else if n = 1 then Var x else Power (x,n)
let rec diff (e,x) = match e with
  | Const _ -> Const 0
  | Var y -> Const (if x = y then 1 else 0)
  | Power (y,n) -> if x <> y || n = 0 then Const 0
      else product [Const n; power y (n-1)]
  | Sum es -> sum (List.map (fun e -> diff (e,x)) es)
  | Times [] -> Const 0
  | Times (h::t) -> sum [product [diff (h,x); product t]; product [h; diff (Times t,x)]]

let checks = ref 0
let check label ok = incr checks; if not ok then failwith label
let () =
  check "range" (range 3 7 = [3;4;5;6;7]);
  check "range singleton max_int" (range max_int max_int = [max_int]);
  check "range empty" (range 3 2 = []);
  check "concat" (concat [[1;2];[];[3]] = [1;2;3]);
  check "concat empty" (concat [] = []);
  check "zipper left/right leftovers" (zipper [1;3;5] [2] = [1;2;3;5] && zipper [1] [2;4] = [1;2;4]);
  check "zipper empty" (zipper [] [] = []);
  check "unzip" (unzip [1,"a";2,"b"] = ([1;2],["a";"b"]));
  check "unzip empty" (unzip [] = ([],[]));
  check "drop" (drop [1;2;3] 2 = [3] && drop [1] 9 = [] && drop [1] 0 = [1]);
  check "sigma" (sigma (fun x -> x*x) 1 7 = 140 && sigma Fun.id 4 3 = 0);
  check "iter" (iter (5,fun x -> x+2) 0 = 10 && iter (0,fun _ -> failwith "called") 7 = 7);
  check "iter rejects negative" (try ignore (iter (-1,Fun.id) 0); false with Invalid_argument _ -> true);
  check "all" (all (fun x -> x > 0) [1;2] && not (all (fun x -> x > 0) [1;0]) && all (fun _ -> false) []);
  check "digits" (lst2int [1;2;3] = 123 && lst2int [0;4] = 4 && lst2int [] = 0);
  List.iter (fun xs ->
    check "fold length" (length_r xs = List.length xs && length_l xs = List.length xs);
    check "fold reverse" (reverse_r xs = List.rev xs && reverse_l xs = List.rev xs);
    check "fold positive" (positive_r xs = List.for_all ((<) 0) xs && positive_l xs = List.for_all ((<) 0) xs);
    check "fold map" (map_r succ xs = List.map succ xs && map_l succ xs = List.map succ xs);
    check "fold filter" (filter_r ((<) 0) xs = List.filter ((<) 0) xs && filter_l ((<) 0) xs = List.filter ((<) 0) xs)
  ) [[];[1];[3;0;-2;4]];
  let rec nat n = if n = 0 then ZERO else SUCC (nat (n-1)) in
  for a = 0 to 5 do for b = 0 to 5 do
    check "nat add" (natadd (nat a) (nat b) = nat (a+b));
    check "nat mul" (natmul (nat a) (nat b) = nat (a*b))
  done done;
  let polynomial = Sum [Power ("x",2); Times [Const 2;Var "x"];Const 1] in
  check "differentiation book example" (diff (polynomial,"x") = Sum [Times [Const 2;Var "x"];Const 2]);
  check "constant power" (diff (Power ("x",0),"x") = Const 0);
  check "other variable" (diff (Power ("y",3),"x") = Const 0);
  check "empty product" (diff (Times [],"x") = Const 0);
  check "empty sum" (diff (Sum [],"x") = Const 0);
  (* Check the product rule against known derivatives at several inputs. *)
  let rec value x = function
    | Const n -> n | Var "x" -> x | Var _ -> 3
    | Power (v,n) -> let b = if v = "x" then x else 3 in
        let rec pow n = if n=0 then 1 else b * pow (n-1) in pow n
    | Sum es -> List.fold_left (fun a e -> a+value x e) 0 es
    | Times es -> List.fold_left (fun a e -> a*value x e) 1 es in
  for x = -3 to 3 do
    check "three-factor product" (value x (diff (Times [Var "x";Var "x";Var "x"],"x")) = 3*x*x)
  done;
  Printf.printf "Textbook 2.4: %d checks passed.\n" !checks
