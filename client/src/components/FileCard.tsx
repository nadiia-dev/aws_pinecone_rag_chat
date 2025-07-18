import { Button } from "./ui/button";

const FileCard = ({ file }: { file: File }) => {
  const onRemove = () => {};
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Uploaded File</h3>
      <div className="text-sm">
        <p>
          <strong>Name:</strong> {file.name}
        </p>
        <p>
          <strong>Size:</strong> {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <Button variant="destructive" size="sm" onClick={onRemove}>
        Remove file
      </Button>
    </div>
  );
};

export default FileCard;
