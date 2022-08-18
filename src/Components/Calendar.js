const Calendar = (props) => {
  return (
    <DateRangePicker
      ranges={[props.selectionRange]}
      onChange={props.onChange}
    />
  );
};

export default Calendar;
