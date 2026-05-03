'use client';

import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useWindowSize';

export default function HeroSection() {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <section
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 80% 20%, rgba(217,120,148,0.07) 0%, transparent 60%), #FFF7F9',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: isMobile ? '0 1rem' : '0 2rem',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* TWO COLUMN GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '3rem',
            width: '100%',
            paddingTop: '5rem',
            paddingBottom: '5rem',
          }}
        >
          {/* ===== LEFT COLUMN ===== */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            {/* Trust badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '1px solid rgba(217,120,148,0.3)',
                backgroundColor: 'rgba(217,120,148,0.05)',
                marginBottom: '1.5rem',
                width: 'fit-content',
              }}
            >
              <span style={{ color: '#D97894', fontSize: '1rem' }}>🛡️</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#D97894',
                }}
              >
                100% Confidential · Doctor-Led · Stigma-Free
              </span>
            </div>

            {/* Main headline */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 'clamp(2rem, 8vw, 4.5rem)',
                  fontWeight: '700',
                  color: '#3D3438',
                  lineHeight: '1.1',
                  display: 'block',
                }}
              >
                Your Health.
              </div>
              <div
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 'clamp(2rem, 8vw, 4.5rem)',
                  fontWeight: '700',
                  fontStyle: 'italic',
                  color: '#D97894',
                  lineHeight: '1.1',
                  display: 'block',
                }}
              >
                Your Privacy.
              </div>
              <div
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 'clamp(2rem, 8vw, 4.5rem)',
                  fontWeight: '700',
                  color: '#3D3438',
                  lineHeight: '1.1',
                  display: 'block',
                }}
              >
                Our Promise.
              </div>
            </div>

            {/* Subtext */}
            <p
              style={{
                fontSize: '1.125rem',
                color: '#4B5563',
                lineHeight: '1.75',
                maxWidth: '32rem',
                marginBottom: '2rem',
              }}
            >
              India&apos;s most trusted women&apos;s health ecosystem — where expert
              gynecologists, radiologists, and surgeons come together to deliver
              complete, compassionate, and confidential care to every woman
              across India.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '1rem',
                flexWrap: 'wrap',
                marginBottom: '2.5rem',
              }}
            >
              <button
                onClick={() => router.push('/auth/login')}
                style={{
                  backgroundColor: '#D97894',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '1rem 2rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s',
                  width: isMobile ? '100%' : 'auto',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#C45F7E')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97894')}
              >
                💬 Start Anonymous Consultation
              </button>

              <button
                onClick={() => router.push('/patient/book')}
                style={{
                  backgroundColor: 'transparent',
                  color: '#D97894',
                  border: '2px solid #D97894',
                  borderRadius: '9999px',
                  padding: '1rem 2rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: isMobile ? '100%' : 'auto',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDE8F0')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                ♥ Explore Care Modules
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { number: '50K+', label: 'Women Helped' },
                { number: '3', label: 'Expert Doctors' },
                { number: '100%', label: 'Confidential' },
                { number: '24/7', label: 'Care Support' },
              ].map((stat, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: '700',
                      color: '#D97894',
                      fontFamily: '"Playfair Display", Georgia, serif',
                    }}
                  >
                    {stat.number}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: '#9CA3AF',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginTop: '0.15rem',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div
            style={{
              position: 'relative',
              display: isMobile ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '500px',
              overflow: 'hidden',
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: 'absolute',
                width: '360px',
                height: '360px',
                border: '2px solid rgba(217,120,148,0.12)',
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '220px',
                height: '220px',
                backgroundColor: 'rgba(217,120,148,0.05)',
                borderRadius: '50%',
              }}
            />

            {/* Card 1 — Doctor */}
            <div
              style={{
                position: 'absolute',
                top: '2rem',
                right: '0',
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                padding: '1rem',
                border: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                minWidth: '220px',
                animation: 'heroFloat1 4s ease-in-out infinite',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#D97894',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                }}
              >
                SP
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#3D3438' }}>
                  Dr. Snehal Pansare
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Gynecologist</div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '2px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#16A34A',
                      borderRadius: '50%',
                      display: 'inline-block',
                    }}
                  />
                  Available Now
                </div>
              </div>
            </div>

            {/* Card 2 — Anonymous */}
            <div
              style={{
                position: 'absolute',
                top: '45%',
                left: '0.5rem',
                transform: 'translateY(-50%)',
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                padding: '1rem',
                border: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                minWidth: '200px',
                animation: 'heroFloat2 3.5s ease-in-out infinite',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#FDE8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0,
                }}
              >
                🔒
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#3D3438' }}>
                  Anonymous Consultation
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '2px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#16A34A',
                      borderRadius: '50%',
                      display: 'inline-block',
                    }}
                  />
                  Live
                </div>
              </div>
            </div>

            {/* Card 3 — Period Tracker */}
            <div
              style={{
                position: 'absolute',
                bottom: '3rem',
                right: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                padding: '1rem',
                border: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                minWidth: '180px',
                animation: 'heroFloat3 4.5s ease-in-out infinite',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#FBF3DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0,
                }}
              >
                📊
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#3D3438' }}>
                  Period Tracker
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  Next cycle in 8 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
