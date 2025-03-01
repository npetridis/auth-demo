export default function PostsLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <div>
      {/* The main content (post list, etc.) */}
      {children}

      {/* If /posts/add-new is visited, Next.js mounts that page in `modal` */}
      {modal}
    </div>
  );
}
