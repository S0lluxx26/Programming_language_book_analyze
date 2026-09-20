(* Generated from the exact displayed, complete chapter walkthroughs. Interpreter fragments are excluded. *)
module Chapter1 = struct
type tree = Leaf | Fork of tree * tree
let rec leaves = function
  | Leaf -> 1
  | Fork (left, right) ->
      leaves left + leaves right
let () = assert (leaves (Fork (Leaf, Leaf)) = 2)
end

module Chapter2 = struct
let rec length xs =
  match xs with
  | [] -> 0
  | _ :: tail ->
      1 + length tail
let () = assert (length [4;7;9] = 3); assert (length [] = 0)
end

module Chapter4 = struct
let result =
  let x = 10 in
  let f = fun y -> x + y in
  let x = 100 in
  f 3
let () = assert (result = 13)
end

module Chapter5 = struct
let rec map f xs =
  match xs with
  | [] -> []
  | h :: t ->
      let mapped_head = f h in
      let mapped_tail = map f t in
      mapped_head :: mapped_tail
let () = assert (map (fun n -> n + 1) [1;2] = [2;3])
end

module Chapter6 = struct
let result =
  let r = ref 0 in
  let alias = r in
  alias := !alias + 1;
  !r
let () = assert (result = 1)
end

module Chapter7 = struct
type counter = { mutable count : int }
let original = { count = 0 }
let alias = original
let () = alias.count <- 7
let observed = original.count
let () = assert (observed = 7)
end

module Chapter9 = struct
type term = Var of string | Lam of string * term | App of term * term
let rec free x = function
  | Var y -> x = y
  | Lam (y, body) -> x <> y && free x body
  | App (left, right) -> free x left || free x right
let () = assert (free "y" (Lam ("x", Var "y"))); assert (not (free "x" (Lam ("x", Var "x"))))
end

let () = print_endline "Seven chapter walkthroughs passed"
