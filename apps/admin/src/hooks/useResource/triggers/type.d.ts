export interface DropzoneTriggerProps {
  label: string;
  hint: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  error?: string | null;
}

export interface DropzoneTriggerHasImageProps {
  selectedResource: ResourceResponse | null;
  onOpen: () => void;
  error?: DropzoneTriggerHasImageProps["error"];
}

export interface DropzoneTriggerNoImageProps {
  label: DropzoneTriggerProps["label"];
  hint: DropzoneTriggerProps["hint"];
  onOpen: () => void;
  error?: DropzoneTriggerHasImageProps["error"];
}
