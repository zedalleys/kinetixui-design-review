export const PlanCard = ({ title, body }: { title: string; body: string }) => (
  <article className="card"><h3>{title}</h3><p>{body}</p></article>
);
// All three cards are correct, accessible and consistent with each other. No rule requires a shared Card.
