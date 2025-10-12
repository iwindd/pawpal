interface DropzoneTriggerBase {
  error?: string | null;
  h?: number | string;
}

export interface DropzoneTriggerProps extends DropzoneTriggerBase {
  label?: string;
  placeholder?: string;
  hint: string;
  onChange?: (value: string | null) => void;
  defaultValue?: string;
  value?: string;
}

export interface DropzoneTriggerHasImageProps extends DropzoneTriggerBase {
  selectedResource: ResourceResponse | null;
  onOpen: () => void;
}

export interface DropzoneTriggerNoImageProps extends DropzoneTriggerBase {
  placeholder?: DropzoneTriggerProps["placeholder"];
  hint: DropzoneTriggerProps["hint"];
  onOpen: () => void;
}
