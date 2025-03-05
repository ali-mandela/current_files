import { Link } from 'react-router-dom';
const PresentationComponent = ({item}) => {
  return (
    <Link key={item.id} to={`/dashboard/${item.id}`}>
      <div
        style={{
          backgroundImage: item.thumbnail ? `url(${item.thumbnail})` : 'none',
          backgroundColor: item.thumbnail ? 'transparent' : 'gray',  
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
        }}
        className="min-w-[100px] relative rounded-sm hover:shadow-lg aspect-[2/1]  my-1"
      >
        <h3 className="text-xl p-1 rounded-sm bg-slate-300">{item.name}</h3>
        <p className="text-md font-bold my-4 text-center bg-neutral-50">{item.description}</p>
        <p className="absolute right-0 bottom-0 flex items-center justify-center font-semibold text-xl w-12 h-12 rounded-full bg-slate-300">
          {item.slides?.length || 1}
        </p>
      </div>
    </Link>
  )
}

export default PresentationComponent