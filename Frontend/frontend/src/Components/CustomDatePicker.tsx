import DatePicker from 'react-datepicker';
import '../Styles/datepicker.css'

type Props = {
    onChange: (date: Date | null) => void;
    selected: Date | null;
}

function CustomDatePicker({ onChange, selected }: Props) {
    return (
        <DatePicker
            selected={selected}
            onChange={onChange}
            inline
        />
    )
}

export default CustomDatePicker