import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type RatingInputProps = {
  name: string;
  labelText: string;
};

export default function RatingInput({ name, labelText }: RatingInputProps) {
   const numbers = Array.from({ length: 5 }, (_, i) => {
    const value = i + 1;
    return value.toString();
  }).reverse();

  return (
    <div className="mb-2 max-w-xs">
        <Label htmlFor={name} className='capitalize'>
            {labelText || name}
        </Label>
        <Select defaultValue={numbers[0]} name={name} required>
          <SelectTrigger>
             <SelectValue />
          </SelectTrigger>
          <SelectContent>
          {numbers.map((number) => {
            return (
              <SelectItem key={number} value={number}>
                {number}
              </SelectItem>
            );
          })}
        </SelectContent>
        </Select>
    </div>
  );
}
