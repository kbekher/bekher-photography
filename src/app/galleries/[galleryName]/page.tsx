import GalleryContent from "@/components/GalleryContent";

const Gallery = async ({ params }: { params: Promise<{ galleryName: string }> }) => {
  const { galleryName } = await params;
  return <main><GalleryContent galleryName={galleryName} /></main>;
}

export default Gallery;
