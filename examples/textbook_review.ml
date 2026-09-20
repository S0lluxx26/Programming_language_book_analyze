(* Complete OCaml examples displayed in the second textbook/PDF review.
   Integer results are assumed to fit the host range. *)
module IntQueue = struct
  type t = int list
  exception Empty
  let empty : t = []
  let enq (q : t) x = q @ [x]
  let deq (q : t) = match q with
    | [] -> raise Empty
    | first :: rest -> (first, rest)
end

let factorial n =
  if n < 0 then invalid_arg "factorial: negative input";
  let rec loop remaining acc =
    if remaining = 0 then acc
    else loop (remaining - 1) (remaining * acc)
  in
  loop n 1

let checks = ref 0
let check name ok = incr checks; if not ok then failwith name
let () =
  let q0 = IntQueue.empty in
  let q1 = IntQueue.enq q0 10 in
  let q2 = IntQueue.enq q1 20 in
  let first,rest = IntQueue.deq q2 in
  check "queue preserves earlier values" (q0=[] && q1=[10] && q2=[10;20]);
  check "queue first-in first-out" (first=10 && rest=[20]);
  check "queue remaining dequeue" (IntQueue.deq rest=(20,[]));
  check "empty queue error" (try ignore(IntQueue.deq q0); false with IntQueue.Empty -> true);
  check "factorial zero" (factorial 0=1);
  check "factorial one" (factorial 1=1);
  check "factorial five" (factorial 5=120);
  check "factorial rejects negative" (try ignore(factorial (-1)); false with Invalid_argument _ -> true);
  Printf.printf "Textbook review examples: %d checks passed.\n" !checks
