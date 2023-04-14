import ThemeContext from '../../../context/ThemeContext'
import { Modal, View } from 'react-native'
import DatePicker from 'react-native-modern-datepicker'
import { useContext } from 'react'

const DateModal = ({
    selected,
    onDateChange,
}) => {
    const theme = useContext(ThemeContext)

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
        >
            <View className="flex flex-col items-center justify-center w-full h-full">
                <View 
                    className="m-20 rounded-md w-11/12 p-4 items-center shadow-lg"
                    style={{ backgroundColor: theme.accent }}
                >
                    <DatePicker
                        mode="monthYear"
                        selected={selected}
                        onMonthYearChange={onDateChange}
                        options={{
                            mainColor: theme.primary,
                            backgroundColor: theme.accent,
                            textDefaultColor: theme.text,
                            textHeaderColor: theme.text,
                        }}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default DateModal