import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/internal/preview-api";
import {
  TransactionAttachment,
  FileIcon,
  AttachmentCard,
  FileUpload,
} from "./transaction-attachment";
import { TransactionAttachmentProps } from "./transaction-attachment.types";
import { TRANSACTION_ATTACHMENT_DEFAULT_PROPS } from "./use-transaction-attachment";

const mockUpload = async (transactionId: string, file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    url: `transactions/${transactionId}/${Date.now()}_${file.name}`,
    name: file.name,
  };
};

const mockDownload = async (transactionId: string, fileName: string) => {
  return new Blob([`Mock file content for ${transactionId} and ${fileName}`], { type: "text/plain" });
};

const mockDelete = async (transactionId: string, fileName: string) => {
  console.log(`Deleting file ${fileName} for transaction ${transactionId}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

const mockTransaction = {
  id: "123",
  attachment_url: "transactions/123/1234567890_example.pdf",
  attachment_name: "Comprovante de Pagamento.pdf",
};

const mockTransactionWithoutAttachment = {
  id: "124",
  attachment_url: null,
  attachment_name: null,
};

export default {
  title: "Transaction Attachment",
  component: TransactionAttachment,
  argTypes: {
    mode: {
      control: { type: "select" },
      options: ["create", "edit"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    onFileSelect: { action: "fileSelected" },
    onAttachmentChange: { action: "attachmentChanged" },
    onUpload: { action: "uploaded" },
    onDownload: { action: "downloaded" },
    onDelete: { action: "deleted" },
  },
  args: {
    ...TRANSACTION_ATTACHMENT_DEFAULT_PROPS,
    onUpload: mockUpload,
    onDownload: mockDownload,
    onDelete: mockDelete,
  },
} satisfies Meta<typeof TransactionAttachment>;

export const CreateMode: StoryObj<typeof TransactionAttachment> = {
  args: {
    mode: "create",
  },

  render: function CreateMode(props: TransactionAttachmentProps) {
    return (
      <div className="w-full max-w-md">
        <TransactionAttachment
          {...props}
          mode="create"
          onFileSelect={(file) => {
            props.onFileSelect?.(file);
          }}
        />
      </div>
    );
  },
};

export const EditWithoutAttachment: StoryObj<typeof TransactionAttachment> = {
  args: {
    mode: "edit",
  },

  render: function EditWithoutAttachment(props: TransactionAttachmentProps) {
    const [, updateArgs] = useArgs();

    return (
      <div className="w-full max-w-md">
        <TransactionAttachment
          {...props}
          mode="edit"
          transaction={mockTransactionWithoutAttachment}
          onAttachmentChange={(transaction) => {
            updateArgs({ transaction });
            props.onAttachmentChange?.(transaction);
          }}
        />
      </div>
    );
  },
};

export const EditWithAttachment: StoryObj<typeof TransactionAttachment> = {
  args: {
    mode: "edit",
  },

  render: function EditWithAttachment(props: TransactionAttachmentProps) {
    const [, updateArgs] = useArgs();

    return (
      <div className="w-full max-w-md">
        <TransactionAttachment
          {...props}
          mode="edit"
          transaction={mockTransaction}
          onAttachmentChange={(transaction) => {
            updateArgs({ transaction });
            props.onAttachmentChange?.(transaction);
          }}
        />
      </div>
    );
  },
};

export const Disabled: StoryObj<typeof TransactionAttachment> = {
  args: {
    mode: "edit",
    disabled: true,
  },

  render: function Disabled(props: TransactionAttachmentProps) {
    return (
      <div className="w-full max-w-md">
        <TransactionAttachment
          {...props}
          mode="edit"
          transaction={mockTransaction}
          disabled={true}
        />
      </div>
    );
  },
};

export const FileIconExample: StoryObj<typeof FileIcon> = {
  render: function FileIconExample() {
    return (
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <FileIcon fileName="document.pdf" />
          <span className="text-xs text-muted-foreground">PDF</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FileIcon fileName="image.jpg" />
          <span className="text-xs text-muted-foreground">Image</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FileIcon fileName="spreadsheet.xlsx" />
          <span className="text-xs text-muted-foreground">Excel</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FileIcon fileName="text.txt" />
          <span className="text-xs text-muted-foreground">Text</span>
        </div>
      </div>
    );
  },
};

export const AttachmentCardExample: StoryObj<typeof AttachmentCard> = {
  render: function AttachmentCardExample() {
    return (
      <div className="w-full max-w-md">
        <AttachmentCard
          fileName="Comprovante de Pagamento.pdf"
          fileStatus="Arquivo anexado"
          onDownload={() => {}}
          onDelete={() => {}}
          showDownload={true}
          showDelete={true}
        />
      </div>
    );
  },
};

export const FileUploadExample: StoryObj<typeof FileUpload> = {
  render: function FileUploadExample() {
    return (
      <div className="w-full max-w-md">
        <FileUpload
          onFileSelect={() => {}}
          disabled={false}
          isUploading={false}
        />
      </div>
    );
  },
};
