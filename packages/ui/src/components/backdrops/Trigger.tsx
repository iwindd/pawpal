interface ShowProps {
  text?: string;
}

export const show = ({ text }: ShowProps) => {
  document.dispatchEvent(
    new CustomEvent("triggerLoading", {
      detail: { isLoading: true, text: text },
    })
  );
};

export const hide = () => {
  document.dispatchEvent(
    new CustomEvent("triggerLoading", { detail: { isLoading: false } })
  );
};
