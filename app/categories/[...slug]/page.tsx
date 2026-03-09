export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {

  const { slug } = await params

  return (
    <div>
      Category page
    </div>
  )
}