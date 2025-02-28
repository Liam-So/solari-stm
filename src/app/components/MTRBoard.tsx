import MTRRow from "./MTRRow";

type MTRBoardProps = {
  boardData: any
}

const MTRBoard: React.FC<MTRBoardProps> = ({boardData}) => {
  return (
    <div className="pb-16">
      <div className="text-gray-400 text-sm mb-2 flex">
        <div className='flex w-full justify-between items-center px-2'>
          <div>TIME</div>
          <div>DESTINATION</div>
          <div>REMARKS</div>
        </div>
      </div>

      {boardData && boardData.map((row, index) => (
        <MTRRow
          key={index}
          destination={row.destination}
          time={row.time}
          remarks={row.remarks}
          color={row.color}
        />
      ))}
    </div>
  )
}


export default MTRBoard;