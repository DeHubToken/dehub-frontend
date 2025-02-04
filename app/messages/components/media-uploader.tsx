import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { FileUploader } from "react-drag-drop-files";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { supportedNetworks } from "@/web3/configs";

import { env, supportedTokens } from "@/configs";

import { useMessage } from "./provider";

const fileTypes = ["JPG", "PNG", "GIF", "mp4"];

interface SelectedFile {
  id: number;
  file: File;
  filename: string;
  filetype: string;
  fileimage: string | ArrayBuffer | null;
  datetime: string;
  filesize: string;
}

interface UploadStatus {
  [key: string]: {
    progress?: number;
    isDisabled: boolean;
    isUploaded?: boolean;
    isFailed?: boolean;
  };
}

const MediaUploader: React.FC = () => {
  const {
    toggleMedia: isOpen,
    handleToggleMedia: toggleModal,
    selectedMessage,
    reValidateMessage
  }: any = useMessage("FileUpload");
  const { _id: conversationId, conversationType }: { _id: string; conversationType: string } =
    selectedMessage;
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({});
  const [isUploading, setIsUploading] = useState(false); // Loading state
  const { account } = useActiveWeb3React();
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const filesizes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const inputChange = (files: FileList) => {
    const selectedFilesArray = Array.from(files);

    selectedFilesArray.forEach((file) => {
      const fileExists = selectedFiles.some((existingFile) => existingFile.filename === file.name);
      if (!fileExists) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFiles((prevValue) => [
            ...prevValue,
            {
              id: prevValue.length,
              file,
              filename: file.name,
              filetype: file.type,
              fileimage: reader.result,
              datetime: new Date(file.lastModified).toLocaleString("en-IN"),
              filesize: filesizes(file.size),
              isLockedContent: false,
              amountToUnlock: null
            }
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const deleteSelectFile = (id: number, filename: string) => {
    const updatedFiles = selectedFiles.filter((file) => file.id !== id);
    setUploadStatus((prevStatus) => {
      const updatedStatus = { ...prevStatus };
      delete updatedStatus[filename];
      return updatedStatus;
    });
    setSelectedFiles(updatedFiles);
  };

  const resetState = () => {
    setSelectedFiles([]);
    setUploadStatus({});
  };

  const fileUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length <= 0) {
      toast.error("Please select files to upload.");
      return;
    }
    if (!account) {
      toast.error("Please connect to wallet.");
      return;
    }
    const formData = new FormData();
    selectedFiles.forEach((fileData) => {
      formData.append("files", fileData.file); // Add each file to FormData
    });
    formData.append("conversationId", conversationId);
    formData.append("senderId", account);
    formData.append("isPaid", isPaid.toString());
    if (isPaid) {
      if (!token && !amount) {
        toast.error("Please select token and add amount.");

        return;
      }

      const purchaseOptions = [
        {
          address: token,
          isLocked: true,
          amount,
          chainId: supportedTokens.find((t) => t.address == token)?.chainId
        }
      ];
      formData.append("purchaseOptions", JSON.stringify(purchaseOptions));
    }

    try {
      setIsUploading(true); // Set uploading state to true
      setUploadStatus((prevStatus) => {
        const newStatus = { ...prevStatus };
        selectedFiles.forEach((fileData) => {
          newStatus[fileData.filename] = { isDisabled: true };
        });
        return newStatus;
      });

      const response = await axios.post(`${env.NEXT_PUBLIC_API_BASE_URL}/dm/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total }: any = progressEvent;
          const progress = Math.round((loaded * 100) / total);
          selectedFiles.forEach((fileData) => {
            setUploadStatus((prevStatus) => ({
              ...prevStatus,
              [fileData.filename]: { progress, isDisabled: true }
            }));
          });
        }
      });

      reValidateMessage(response.data._id, conversationId);
      // If the request is successful, update the upload status
      selectedFiles.forEach((fileData) => {
        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [fileData.filename]: { isUploaded: true, isFailed: false, isDisabled: true }
        }));
      });
      toast.success("Files uploaded successfully!");
      resetState(); // Reset state after successful upload
      toggleModal(); // Close the modal after the upload
    } catch (error) {
      selectedFiles.forEach((fileData) => {
        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [fileData.filename]: { isFailed: true, isUploaded: false, isDisabled: false }
        }));
      });
      toast.error("Upload failed. Please try again.");
      resetState(); // Reset state after failure
      toggleModal(); // Close the modal after the upload failure
      throw error;
    } finally {
      setIsUploading(false); // Reset uploading state after completion
    }
  };

  const handleCheckboxChange = () => {
    setIsPaid(!isPaid);
    if (isPaid) setAmount(""); // Clear amount if unchecked
  };
  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogContent>
        <div className="space-y-4">
          <div className="shadow-lg rounded-lg p-6">
            <div className="mb-4">
              <h6 className="text-xl font-semibold">Multiple File Upload with Preview</h6>
            </div>
            <form onSubmit={fileUploadSubmit}>
              <FileUploader
                className="mb-4 w-full border-2 border-dashed border-gray-300 p-4"
                handleChange={inputChange}
                multiple
                name="file"
                types={fileTypes}
              />
              <div className="max-h-60 space-y-3 overflow-y-auto">
                <ul>
                  {selectedFiles.map((file) => (
                    <li key={file.id} className="flex items-center space-x-4">
                      {file.filetype.startsWith("image/") && (
                        <Image
                          src={file.fileimage as string}
                          alt={file.filename}
                          height={100}
                          width={100}
                          className="rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p>
                          <strong>Name:</strong> {file.filename}
                        </p>
                        <p>
                          <strong>Size:</strong> {file.filesize}
                        </p>
                        <div>
                          {uploadStatus[file.filename]?.progress && (
                            <div>
                              <span>Uploading: {uploadStatus[file.filename]?.progress}%</span>
                            </div>
                          )}
                          {uploadStatus[file.filename]?.isUploaded && (
                            <span className="text-green-500">Uploaded!</span>
                          )}
                          {uploadStatus[file.filename]?.isFailed && (
                            <span className="text-red-500">Upload Failed</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteSelectFile(file.id, file.filename)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {conversationType == "dm" && (
                <div className="mt-5 max-h-60 space-y-3 overflow-y-auto">
                  <div className="flex gap-5">
                    <Checkbox
                      id="isPaid"
                      checked={isPaid}
                      onCheckedChange={handleCheckboxChange}
                    ></Checkbox>
                    <label htmlFor="isPaid">Is Paid Content</label>
                  </div>
                  {isPaid && (
                    <div className="space-y-2">
                      <label htmlFor="payment-amount" className="text-sm font-semibold">
                        Set Amount to Pay
                      </label>
                      <div className="flex items-center gap-2 p-5">
                        {" "}
                        {/* Added items-center and gap for proper alignment */}
                        <Input
                          id="payment-amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Select value={token} onValueChange={(value) => setToken(value)}>
                          <SelectTrigger className="h-10 min-w-32 rounded-md bg-transparent dark:bg-transparent">
                            {" "}
                            {/* Set height and ensure matching with Input */}
                            <SelectValue placeholder="Select token" />
                          </SelectTrigger>
                          <SelectContent>
                            {supportedTokens.map((token, i: number) => {
                              const network = supportedNetworks.find(
                                (net) => net.chainId == token.chainId
                              );
                              return (
                                <SelectItem key={i} value={token.address}>
                                  <div className="flex items-center gap-4">
                                    <Image
                                      src={token.iconUrl}
                                      width={24}
                                      height={24}
                                      alt={token.label}
                                      className="size-10"
                                    />
                                    <span className="text-lg">{token.label}</span>
                                    {network?.value || network?.chainId}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-4 flex justify-end gap-4">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  disabled={isUploading} // Disable button while uploading
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                  onClick={toggleModal}
                  disabled={isUploading} // Disable Close button while uploading
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { MediaUploader };
