import FileUpload from "@/components/features/FileUpload";

const Ingestion = () => {
  return (
    <div className=" w-full h-full p-4">
      <h2 className="text-2xl text-black">Upload documents</h2>
      <FileUpload />
    </div>
  );
};
export default Ingestion;
