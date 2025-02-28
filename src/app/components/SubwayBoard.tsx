import SubwayRow from "./SubwayRow";

type SubwayBoardProps = {
  boardData: any
}

const SubwayBoard: React.FC<SubwayBoardProps> = ({ boardData }) => {
  return (
    <div className="pb-16">
      <div className="text-gray-400 text-sm mb-2 flex">
        <div className='flex w-full justify-between items-center px-2'>
          <div>LINE</div>
          <div>DESTINATION</div>
          <div>TIME</div>
        </div>
      </div>

      {boardData && boardData.map((row, index) => (
        <SubwayRow
          key={index}
          trainLine={row.line}
          destination={row.destination}
          time={row.time}
          color={row.color}
        />
      ))}

    </div>
  )
}


export default SubwayBoard;