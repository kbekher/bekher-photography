interface Props {
  params: {
    galleryName: string;
  };
}

const GalleryPage = async ({ params }: Props) => {
  const { galleryName } = await params; // Extract from Next.js params

  return (
    <div>
      <h1>Gallery: {galleryName.toUpperCase()}</h1>
      <p>Displaying content for {galleryName} gallery.</p>
    </div>
  );
};

export default GalleryPage;