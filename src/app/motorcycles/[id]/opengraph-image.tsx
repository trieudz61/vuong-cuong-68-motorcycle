import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'
export const alt = 'Xe máy - Vương Cường 68'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  try {
    // Fetch motorcycle data
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/motorcycles/${params.id}`)
    
    if (!response.ok) {
      throw new Error('Motorcycle not found')
    }
    
    const motorcycle = await response.json()
    
    const formatPrice = (price: number) => {
      if (!price || price === 0) return 'Liên hệ'
      return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1c1917',
            backgroundImage: 'linear-gradient(45deg, #1c1917 0%, #292524 100%)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#f59e0b',
                textAlign: 'center',
              }}
            >
              VƯƠNG CƯỜNG 68
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              width: '90%',
              height: '60%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '40px',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Left - Image */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '40px',
              }}
            >
              {motorcycle.images?.[0] ? (
                <img
                  src={motorcycle.images[0]}
                  alt={motorcycle.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '15px',
                    filter: motorcycle.is_sold ? 'grayscale(100%)' : 'none',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#374151',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                    fontSize: '24px',
                  }}
                >
                  Không có ảnh
                </div>
              )}
            </div>

            {/* Right - Info */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: 'white',
              }}
            >
              {/* Title */}
              <div>
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    lineHeight: 1.2,
                  }}
                >
                  {motorcycle.title}
                </div>
                
                {/* Tags */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '30px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: motorcycle.condition === 'Mới' ? '#10b981' : '#f59e0b',
                      color: '#1c1917',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    {motorcycle.condition}
                  </div>
                  <div
                    style={{
                      backgroundColor: '#374151',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '16px',
                    }}
                  >
                    {motorcycle.brand}
                  </div>
                  <div
                    style={{
                      backgroundColor: '#374151',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '16px',
                    }}
                  >
                    {motorcycle.year}
                  </div>
                  {motorcycle.is_sold && (
                    <div
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      ĐÃ BÁN
                    </div>
                  )}
                </div>
              </div>

              {/* Price */}
              <div
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  padding: '20px',
                  borderRadius: '15px',
                  border: '2px solid #f59e0b',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    color: '#f59e0b',
                    marginBottom: '5px',
                  }}
                >
                  Giá bán
                </div>
                <div
                  style={{
                    fontSize: '42px',
                    fontWeight: 'bold',
                    color: '#f59e0b',
                  }}
                >
                  {formatPrice(motorcycle.price)}
                </div>
              </div>

              {/* Specs */}
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  fontSize: '16px',
                  color: '#d1d5db',
                }}
              >
                <div>{motorcycle.engine_capacity}cc</div>
                <div>•</div>
                <div>{motorcycle.mileage?.toLocaleString()} km</div>
                <div>•</div>
                <div>{motorcycle.color}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: '30px',
              fontSize: '20px',
              color: '#9ca3af',
              textAlign: 'center',
            }}
          >
            06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An
          </div>
        </div>
      ),
      {
        ...size,
      }
    )
  } catch (error) {
    // Fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1c1917',
            color: 'white',
          }}
        >
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b' }}>
            VƯƠNG CƯỜNG 68
          </div>
          <div style={{ fontSize: '24px', marginTop: '20px' }}>
            Xe Máy Cũ Uy Tín
          </div>
        </div>
      ),
      {
        ...size,
      }
    )
  }
}