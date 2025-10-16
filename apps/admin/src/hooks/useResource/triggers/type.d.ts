export interface DropzoneTriggerProps extends DropzoneTriggerBase {
  error?: string | null;
  h?: number | string;
  w?: number | string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  hint?: string;
  onChange?: (value: string | null) => void;
  defaultValue?: string;
  value?: string;
}

export interface DropzoneTriggerHasImageProps extends DropzoneTriggerProps {
  selectedResource: ResourceResponse | null;
  onOpen: () => void;
}

export interface DropzoneTriggerNoImageProps extends DropzoneTriggerProps {
  onOpen: () => void;
}
