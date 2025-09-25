import { Group, Radio, Text, Title } from "@pawpal/ui/core";
import classes from "./style.module.css";

interface RadioMethodProps {
  label: string;
  description: string;
  value: string;
}

const RadioMethod = ({ label, description, value }: RadioMethodProps) => {
  return (
    <Radio.Card className={classes.root} radius="md" value={value}>
      <Group wrap="nowrap" align="center">
        <Radio.Indicator />
        <div>
          <Title order={5} className={classes.label}>
            {label}
          </Title>
          <Text className={classes.description}>{description}</Text>
        </div>
      </Group>
    </Radio.Card>
  );
};

export default RadioMethod;
