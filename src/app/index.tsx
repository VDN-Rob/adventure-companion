import { MouseEventHandler, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [count, setCount] = useState(0);
  function handleClick() {
    // alert('You clicked me!');
    setCount(count + 1);
  }

  return (
    <View style={styles.container}>
      <Text>Cycling Companion</Text>

      <Text>Your offline cycling companion.</Text>

      <Text>No trips yet.</Text>

      <Button title="New Trip" disabled={false} count={count}  onClick={handleClick}/>
      <Button title="" disabled={false} count={count} onClick={handleClick}/>
      <Text>[ + New Trip ]</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});


// Button React component
interface ButtonProps {
  /** Text displayed inside the button */
  title: string;
  /** Whether the button can be interacted with */
  disabled: boolean;

  count: number;
  onClick: MouseEventHandler;
}

export function Button({ title, disabled, count, onClick}: ButtonProps) {
  

  return (
    <button disabled={disabled} onClick={onClick}> {title} Clicked: {count} </button>
  );
}