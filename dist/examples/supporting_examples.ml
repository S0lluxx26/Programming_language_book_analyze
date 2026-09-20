(* Complete examples from the supporting reading guides.
   Run separately from official homework templates: ocaml supporting_examples.ml *)
let square x = x * x
let add x y = x + y
let add_pair (x,y) = x + y

type shape = Tip | Fork of shape * shape
let rec tips t =
  match t with
  | Tip -> 1
  | Fork (left, right) -> tips left + tips right
let rec forks = function
  | Tip -> 0
  | Fork (left, right) -> 1 + forks left + forks right

let fold_probe () =
  let seen = ref [] in
  let all = List.fold_right
    (fun x rest -> seen := x :: !seen; x > 0 && rest)
    [2; -1; 3] true in
  (all, List.rev !seen)

let captured_cell () =
  let cell = ref 10 in
  let read () = !cell in
  cell := 90;
  read ()

let shadowed_cell () =
  let cell = ref 10 in
  let read () = !cell in
  let cell = ref 90 in
  (read (), !cell)

let checks = ref 0
let check label ok = incr checks; if not ok then failwith label
let () =
  check "setup square" (square 6 = 36);
  check "curried versus tupled application" (add 7 4 = 11 && add_pair (7,4) = 11);
  check "base constructor counts" (tips Tip=1 && forks Tip=0);
  let inner = Fork(Tip,Tip) in
  check "one fork counts" (tips inner=2 && forks inner=1);
  let tree = Fork(Tip,inner) in
  check "nested counts" (tips tree=3 && forks tree=2);
  check "invariant on nested tree" (tips tree=forks tree+1);
  let result,order = fold_probe () in
  check "fold predicate result" (not result);
  check "fold visits all elements right to left" (order=[3;-1;2]);
  check "captured reference sees mutation" (captured_cell ()=90);
  check "shadowing leaves captured reference" (shadowed_cell ()=(10,90));
  Printf.printf "Supporting reading examples: %d checks passed.\n" !checks
