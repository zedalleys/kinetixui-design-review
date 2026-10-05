export const ProductCard = ({ title, body }: { title: string; body: string }) => (
  <article className="card"><h3>{title}</h3><p>{body}</p></article>
);
