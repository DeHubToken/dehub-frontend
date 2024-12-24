import { useEffect, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

const MediaList = ({ uploadStatus, selectedFiles, deleteSelectFile, uploadFile, setMediaPayment }: any) => {
  const methods = useForm({
    defaultValues: selectedFiles.reduce((acc: any, file: any) => {
      acc[`isPaid_${file.id}`] = false;
      acc[`amount_${file.id}`] = "";
      return acc;
    }, {}),
  });

  return (
    <FormProvider {...methods}>
      <form>
        <div className="kb-attach-box mb-3">
          {selectedFiles.map((data: any, index: number) => {
            const { id, filename, filetype, fileimage, datetime, filesize } = data;
            return (
              <MediaListItem
                key={id}
                id={id}
                setMediaPayment={setMediaPayment}
                filename={filename}
                fileimage={fileimage}
                filesize={filesize}
                datetime={datetime}
                uploadStatus={uploadStatus}
                deleteSelectFile={deleteSelectFile}
                uploadFile={uploadFile}
                index={index}
                data={data}
              />
            );
          })}
        </div>
      </form>
    </FormProvider>
  );
};

export const MediaListItem = ({
  id,
  filename,
  fileimage,
  filesize,
  datetime,
  uploadStatus,
  deleteSelectFile,
  uploadFile,
  setMediaPayment,
  index,
  data,
}: any) => {
  const { watch, setValue } = useFormContext();

  const isPaid = watch(`isPaid_${id}`);
  const amount = watch(`amount_${id}`);

  useEffect(() => {
    if (!isPaid) {
      setValue(`amount_${id}`, "");
    }
  }, [isPaid]);

  useEffect(() => {
    setMediaPayment(id, isPaid, amount);
  }, [isPaid, amount]);

  return (
    <div className="file-atc-box" key={id}>
      {filename.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
        <div className="file-image">
          <img src={fileimage} alt={filename} />
        </div>
      ) : (
        <div className="file-image">
          <i className="far fa-file-alt"></i>
        </div>
      )}
      <div className="file-detail">
        <h5>{filename}</h5>
        <p>
          <span>Size: {filesize}</span>
          <span className="ml-2">Modified Time: {datetime}</span>
        </p>

        {/* Payment Section */}
        <div className="payment-section">
          <FormField
            name={`isPaid_${id}`}
            render={() => (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <FormControl 
                >
                  <select
                    value={isPaid ? "true" : "false"}
                    onChange={(e) => setValue(`isPaid_${id}`, e.target.value === "true")}
                    disabled={uploadStatus[filename]?.isDisabled}
                  >
                    <option value="true">Paid</option>
                    <option value="false">Not Paid</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
          {isPaid && (
            <FormField
              name={`amount_${id}`}
              render={() => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setValue(`amount_${id}`, e.target.value)}
                      placeholder="Enter amount"
                      disabled={uploadStatus[filename]?.isDisabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>

        <UploadProgress progress={uploadStatus[filename]?.progress || 0} />
        <div className="file-actions">
          {!uploadStatus[filename]?.isUploaded && (
            <button
              type="button"
              className="file-action-btn"
              onClick={() => deleteSelectFile(id, filename)}
              disabled={uploadStatus[filename]?.isDisabled}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const UploadProgress = ({ progress }: { progress: number }) => {
  return (
    <div>
      <progress value={progress || 0} max="100"></progress>
      <p>Upload Progress: {(progress || 0).toFixed(2)}%</p>
    </div>
  );
};

export default MediaList;
