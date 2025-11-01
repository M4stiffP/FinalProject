import React from 'react'

const NewsSection: React.FC = () => {
  const newsItems = [
    {
      date: '2025.07.15',
      title: 'Gachiakuta Anime Release Date Announced!',
      excerpt: 'The highly anticipated anime adaptation will premiere this July with Studio Bones taking the lead on production.',
      category: 'ANIME'
    },
    {
      date: '2025.06.20',
      title: 'New Manga Chapter Released',
      excerpt: 'Chapter 89 of Gachiakuta manga is now available. Rudo faces his greatest challenge yet in the depths of the Pit.',
      category: 'MANGA'
    },
    {
      date: '2025.05.30',
      title: 'Voice Cast Revealed',
      excerpt: 'Meet the talented voice actors bringing your favorite characters to life in the upcoming anime series.',
      category: 'CAST'
    },
    {
      date: '2025.05.15',
      title: 'Official Trailer Released',
      excerpt: 'Get your first look at the animated world of Gachiakuta with our explosive first trailer.',
      category: 'TRAILER'
    }
  ]

  return (
    <section id="news" className="py-20 bg-anime-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-graffiti text-anime-orange mb-4">
              LATEST NEWS
            </h2>
            <div className="w-24 h-1 bg-anime-gold mx-auto"></div>
            <p className="text-gray-300 mt-6 text-lg">
              Stay updated with the latest from the world of Gachiakuta
            </p>
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {newsItems.map((news, index) => (
              <article 
                key={index}
                className="bg-black/60 rounded-lg border border-anime-orange/30 hover:border-anime-orange transition-all duration-300 overflow-hidden group"
              >
                {/* News Header */}
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-anime-gold text-sm font-semibold tracking-wider">
                      {news.category}
                    </span>
                    <time className="text-gray-400 text-sm">
                      {news.date}
                    </time>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-anime-orange transition-colors duration-300 mb-3">
                    {news.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {news.excerpt}
                  </p>
                </div>

                {/* News Footer */}
                <div className="p-6">
                  <button className="text-anime-orange hover:text-orange-400 font-semibold text-sm transition-colors duration-300 flex items-center group">
                    READ MORE
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* View All News Button */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-anime-orange to-anime-red hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              VIEW ALL NEWS
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsSection