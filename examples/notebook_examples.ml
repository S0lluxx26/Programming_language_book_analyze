(* Original, standalone teaching examples for the COSE212 companion.
   Run: ocaml notebook_examples.ml
   These are not the official homework implementations. *)

module Shapes = struct
  type shape = Tip | Fork of shape * shape
  let rec tips = function Tip -> 1 | Fork (l, r) -> tips l + tips r
  let rec forks = function Tip -> 0 | Fork (l, r) -> 1 + forks l + forks r
  let rec mirror = function Tip -> Tip | Fork (l, r) -> Fork (mirror r, mirror l)
end

module Tiny = struct
  type expr = Number of int | Name of string | Plus of expr * expr
            | Bind of string * expr * expr
  exception Unbound of string
  let rec lookup x = function
    | [] -> raise (Unbound x)
    | (y, v) :: rest -> if x = y then v else lookup x rest
  let rec evaluate env = function
    | Number n -> n
    | Name x -> lookup x env
    | Plus (a, b) ->
        let va = evaluate env a in
        let vb = evaluate env b in va + vb
    | Bind (x, definition, body) ->
        let value = evaluate env definition in
        evaluate ((x, value) :: env) body
end

module Store = struct
  type location = int
  type memory = (location * int) list
  exception Missing_location of int
  let rec read location = function
    | [] -> raise (Missing_location location)
    | (l, value) :: rest -> if l = location then value else read location rest
  let write location value memory = (location, value) :: memory
  let fresh memory = List.fold_left (fun n (l, _) -> max n (l + 1)) 0 memory
end

module Types = struct
  type typ = Int | Bool | Unit | List of typ | Arrow of typ * typ | Var of string
  exception Type_error
  let rec occurs name = function
    | Var other -> name = other
    | Arrow (a, b) -> occurs name a || occurs name b
    | List t -> occurs name t
    | Int | Bool | Unit -> false
  let rec apply substitution = function
    | Var name as original ->
        (match List.assoc_opt name substitution with
         | None -> original
         | Some replacement -> apply substitution replacement)
    | Arrow (a, b) -> Arrow (apply substitution a, apply substitution b)
    | List t -> List (apply substitution t)
    | t -> t
  let rec solve substitution = function
    | [] -> substitution
    | (left, right) :: rest ->
        let a = apply substitution left in
        let b = apply substitution right in
        if a = b then solve substitution rest else
        match a, b with
        | Var name, t | t, Var name ->
            if occurs name t then raise Type_error;
            solve ((name, t) :: substitution) rest
        | Arrow (a1, a2), Arrow (b1, b2) ->
            solve substitution ((a1, b1) :: (a2, b2) :: rest)
        | List x, List y -> solve substitution ((x, y) :: rest)
        | _ -> raise Type_error
end

let checks = ref 0
let check condition = incr checks; assert condition
let rejects_type thunk = try ignore (thunk ()); false with Types.Type_error -> true

let () =
  let open Shapes in
  let sample = Fork (Tip, Fork (Tip, Tip)) in
  check (tips sample = 3);
  check (forks sample = 2);
  check (tips sample = forks sample + 1);
  check (mirror (mirror sample) = sample);
  let rec total_lengths = function
    | [] -> 0 | w :: rest -> String.length w + total_lengths rest in
  let total_lengths_tail words =
    let rec loop acc = function
      | [] -> acc | w :: rest -> loop (acc + String.length w) rest
    in loop 0 words in
  check (total_lengths ["ml"; "rules"] = 7);
  check (total_lengths_tail ["ml"; "rules"] = 7);
  check (List.fold_left ( - ) 0 [8;3;1] = -12);
  check (List.fold_right ( - ) [8;3;1] 0 = 6);
  let compose f g x = f (g x) in
  check (compose (fun x -> x * 3) (fun x -> x + 2) 4 = 18);
  let pair = let x = 10 in let f y = x + y in let x = 90 in (f 3, x) in
  check (pair = (13,90));
  let caller_argument = let x = 10 in let f y = x + y in let x = 90 in f x in
  check (caller_argument = 100);
  let open Tiny in
  check (evaluate [] (Bind ("x", Number 4,
    Bind ("x", Plus (Name "x", Number 3), Plus (Name "x", Number 2)))) = 9);
  check (try ignore (evaluate [] (Name "missing")); false with Unbound _ -> true);
  let initial = [0,4] in
  let updated = Store.write 0 6 initial in
  check (Store.read 0 updated = 6);
  check (Store.read 0 initial = 4);
  check (Store.fresh updated = 1);
  let value_call = Store.write 1 9 ((1,4)::initial) in
  let reference_call = Store.write 0 9 initial in
  check (Store.read 0 value_call = 4);
  check (Store.read 0 reference_call = 9);
  let open Types in
  let s = solve [] [Var "b", Int; Var "a", Arrow (Int, Var "c")] in
  check (apply s (Arrow (Var "a", Arrow (Var "b", Var "c"))) =
         Arrow (Arrow (Int, Var "c"), Arrow (Int, Var "c")));
  let chain = solve [] [Var "a", Var "b"; Var "b", Int] in
  check (apply chain (Var "a") = Int);
  check (apply (solve [] [List (Var "a"), List Bool]) (Var "a") = Bool);
  check (rejects_type (fun () -> solve [] [Int, Bool]));
  check (rejects_type (fun () -> solve [] [Var "a", Arrow (Var "a", Int)]));
  check (rejects_type (fun () -> solve [] [Var "a", Arrow (Var "b", Int); Var "b", Var "a"]));
  check (rejects_type (fun () -> solve [] [List Int, List Bool]));
  Printf.printf "Passed %d companion checks.\n" !checks

exception Stop of int
let () =
  let result = try 5 + (raise (Stop 9)) with Stop x -> x + 2 in
  assert (result = 11);
  print_endline "Passed exception-continuation check."
