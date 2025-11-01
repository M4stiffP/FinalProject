import React from 'react'

const VideoDisplay: React.FC = () => {
  return (
    <div 
      className="py-20 flex justify-center items-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/images/background02.png')`
      }}
    >
      <div className="relative group">
        {/* Simple white border frame */}
        <div className="relative transform transition-all duration-700 ease-in-out group-hover:rotate-[-5deg] rotate-[8deg]">
          {/* Video Element - 2x size */}
          <video
            className="w-full h-auto rounded transform transition-transform duration-500 border-4 border-white shadow-lg scale-200"
            style={{ width: '750vw', maxWidth: '1200px', minWidth: '960px' }}
            autoPlay
            loop
            muted
            playsInline
          >
            <source 
              src="https://ik.imagekit.io/6M4sTiff/Splatoon%202%20x%20Nike%20Anime%20Commercial%20(1).mp4?updatedAt=1761913060569" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  )
}

export default VideoDisplay