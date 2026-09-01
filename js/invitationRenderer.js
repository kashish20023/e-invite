function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const str = String(dateStr).trim();
  const match = str.match(/^(\d{1,2})[-.\/](\d{1,2})[-.\/](\d{4})$/);
  if (match) {
    const day = match[1].padStart(2, '0');
    const monthNum = parseInt(match[2], 10);
    const year = match[3];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (monthNum >= 1 && monthNum <= 12) {
      return `${day} ${monthNames[monthNum - 1]} ${year}`;
    }
  }
  return str;
}

function renderTicket(targetElement, data) {
  const container = typeof targetElement === 'string' ? document.querySelector(targetElement) : targetElement;
  if (!container) return;

  const displayDate = formatDisplayDate(data.calendar.displayDate || (data.details && data.details.date));

  // Authentic Calendar days generation for September 2026
  const calendarDays = [];
  const year = data.calendar.year || 2026;
  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  const monthIndex = monthNames.indexOf((data.calendar.month || "SEPTEMBER").toUpperCase());
  const validMonthIndex = monthIndex !== -1 ? monthIndex : 8;

  const daysInMonth = new Date(year, validMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, validMonthIndex, 1).getDay(); // 0=Sun, 1=Mon, 2=Tue
  const firstDayOffset = (firstDayOfWeek + 6) % 7; // Monday-first grid offset

  for (let i = 0; i < firstDayOffset; i++) {
    calendarDays.push('<div class="invitation-calendar-day empty"></div>');
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isHighlight = day === (data.calendar.highlightDate || data.calendar.weddingDay);
    calendarDays.push(`
      <div class="invitation-calendar-day ${isHighlight ? 'highlight' : ''}">
        ${isHighlight ? `<span class="highlight-day-circle">${day}</span>` : day}
      </div>
    `);
  }

  const passenger = (data.boarding && data.boarding.passenger) || "STUDIO I";
  const fromCity = (data.boarding && data.boarding.from) || "YOUR CITY";
  const toCity = (data.boarding && data.boarding.to) || "JAIPUR";
  const flightNo = (data.boarding && data.boarding.flight) || "SI2026";
  const flightTime = (data.boarding && data.boarding.time) || (data.details && data.details.time) || "11:00 AM";
  const flightDate = (data.boarding && data.boarding.date) || displayDate || "07 SEP 2026";
  const noticeText = (data.boarding && data.boarding.notice) || "BOARDING GATE CLOSE 10 MINUTES PRIOR TO DEPARTURE TIME";
  const headerTitle = (data.header && data.header.title) || "AIRLINES TICKET";

  // Build the HTML layout – we keep the original two‑column structure.
  const html = `
    <div class="invitation-layout">
      <!-- LEFT STRIP -->
      <div class="invitation-column">
        <!-- 1ST TICKET: REAL AIRLINE STYLE BOARDING PASS -->
        <div class="airline-boarding-pass">
          <!-- Top Yellow Header Bar -->
          <div class="abp-header">
            <div class="abp-header-left">
              <svg class="abp-plane-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
              <span class="abp-header-title">${headerTitle}</span>
            </div>
            <div class="abp-header-right">
              <span class="abp-header-stub-title">${(data.boarding && data.boarding.title) || "BOARDING PASS"}</span>
            </div>
          </div>

          <!-- Main Body Section -->
          <div class="abp-body">
            <!-- Left Vertical Barcode -->
            <div class="abp-barcode-vertical-container">
              <div class="abp-barcode-v">
                <div class="abp-barcode-v-lines"></div>
                <div class="abp-barcode-v-numbers">0 1 2 3 4 5 6 7 8 9</div>
              </div>
            </div>

            <!-- Right Content Area -->
            <div class="abp-content">
              <!-- Route Section: FROM -> TO -->
              <div class="abp-route-container">
                <div class="abp-city-block abp-from">
                  <div class="abp-label">FROM</div>
                  <div class="abp-city-name">${fromCity}</div>
                </div>

                <div class="abp-flight-path-graphic">
                  <svg viewBox="0 0 160 40" class="abp-arc-svg">
                    <path d="M 10 30 Q 80 0 150 30" fill="none" stroke="#222" stroke-width="1.5" stroke-dasharray="4 4"/>
                    <g transform="translate(25, 10) rotate(-20) scale(0.65)">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#222"/>
                    </g>
                    <g transform="translate(130, 20) rotate(25) scale(0.65)">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#222"/>
                    </g>
                  </svg>
                </div>

                <div class="abp-city-block abp-to">
                  <div class="abp-label">TO</div>
                  <div class="abp-city-name">${toCity}</div>
                </div>
              </div>

              <div class="abp-divider"></div>

              <!-- Passenger Row -->
              <div class="abp-passenger-container">
                <div class="abp-label">PASSENGER</div>
                <div class="abp-passenger-name">${passenger}</div>
              </div>

              <div class="abp-divider"></div>

              <!-- Flight Details Grid (3 Columns) -->
              <div class="abp-details-grid">
                <div class="abp-detail-col">
                  <div class="abp-label">FLIGHT</div>
                  <div class="abp-value">${flightNo}</div>
                </div>
                <div class="abp-detail-col">
                  <div class="abp-label">DATE</div>
                  <div class="abp-value">${flightDate}</div>
                </div>
                <div class="abp-detail-col">
                  <div class="abp-label">TIME</div>
                  <div class="abp-value">${flightTime}</div>
                </div>
              </div>

              <!-- Notice Subtext -->
              <div class="abp-notice-text">${noticeText}</div>
            </div>
          </div>

          <!-- Tear Line / Perforation -->
          <div class="abp-tear-line">
            <div class="abp-notch abp-notch-left"></div>
            <div class="abp-dash"></div>
            <div class="abp-notch abp-notch-right"></div>
          </div>

          <!-- Bottom Stub Section -->
          <div class="abp-stub-section">
            <div class="abp-stub-card">
              <div class="abp-stub-header">
                ${(data.boarding && data.boarding.title) || "BOARDING PASS"}
              </div>
              <div class="abp-stub-body">
                <div class="abp-stub-passenger">
                  <span class="abp-label">PASSENGER</span>
                  <span class="abp-stub-name">${passenger}</span>
                </div>
                <div class="abp-stub-route">
                  <span class="abp-label">FROM</span>
                  <span class="abp-stub-city">${fromCity}</span>
                  <svg class="abp-plane-mini" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                  <span class="abp-label">TO</span>
                  <span class="abp-stub-city">${toCity}</span>
                </div>
                <div class="abp-stub-grid">
                  <div class="abp-detail-col">
                    <div class="abp-label">FLIGHT</div>
                    <div class="abp-value-sm">${flightNo}</div>
                  </div>
                  <div class="abp-detail-col">
                    <div class="abp-label">DATE</div>
                    <div class="abp-value-sm">${flightDate}</div>
                  </div>
                  <div class="abp-detail-col">
                    <div class="abp-label">TIME</div>
                    <div class="abp-value-sm">${flightTime}</div>
                  </div>
                </div>

                <!-- Horizontal Barcode -->
                <div class="abp-barcode-horizontal">
                  <div class="abp-barcode-h-lines"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Welcome Section -->
        <div class="invitation-section theme-navy perforated-top-navy perforated-bottom-navy invitation-welcome">
          <div class="invitation-side-notch-left"></div>
          <div class="invitation-side-notch-right"></div>
          <div class="invitation-welcome-title">${data.welcome.title}</div>
          <div class="invitation-welcome-desc">${data.welcome.description}</div>
        </div>

        <!-- Calendar Card -->
        <div class="invitation-section theme-cream perforated-top-cream perforated-bottom-cream invitation-calendar-card">
          <div class="invitation-calendar-month">${data.calendar.month}</div>
          <div class="invitation-calendar-grid">
            <div class="invitation-calendar-day-header">Mon</div>
            <div class="invitation-calendar-day-header">Tue</div>
            <div class="invitation-calendar-day-header">Wed</div>
            <div class="invitation-calendar-day-header">Thu</div>
            <div class="invitation-calendar-day-header">Fri</div>
            <div class="invitation-calendar-day-header">Sat</div>
            <div class="invitation-calendar-day-header">Sun</div>
            ${calendarDays.join('')}
          </div>
          <div class="invitation-date-footer">${displayDate}</div>
        </div>
      </div>

      <!-- RIGHT STRIP -->
      <div class="invitation-column">
        <!-- Location Section -->
        <div class="invitation-section theme-cream perforated-top-cream perforated-bottom-cream invitation-location">
          <div class="invitation-side-notch-left"></div>
          <div class="invitation-side-notch-right"></div>
          <div class="invitation-location-title">${data.location.title}</div>
          <div class="invitation-location-address">
            <strong>${data.location.address}</strong><br/>
          </div>
          <a href="${data.location.mapUrl}" target="_blank" class="invitation-location-btn">${data.location.buttonText}</a>
          <div class="invitation-venue-photo-frame">
            <img src="${data.images.location}" alt="Venue" />
          </div>
        </div>

        <!-- Details Header (pink – same style as Welcome) -->
        <div class="invitation-section theme-navy perforated-top-navy perforated-bottom-navy invitation-details-header-section">
          <div class="invitation-side-notch-left"></div>
          <div class="invitation-side-notch-right"></div>
          <div class="invitation-details-title">${data.details.title}</div>
        </div>

        <!-- Details Content (white/cream) -->
        <div class="invitation-section theme-cream perforated-top-cream perforated-bottom-cream invitation-details-content">
          <div class="invitation-side-notch-left"></div>
          <div class="invitation-side-notch-right"></div>
          <div class="invitation-detail-block">
            <div class="invitation-detail-label">DATE</div>
            <div class="invitation-detail-value">${displayDate}</div>
          </div>
          <div class="invitation-detail-block">
            <div class="invitation-detail-label">TIME</div>
            <div class="invitation-detail-value">${data.details.time}</div>
          </div>
          <div class="invitation-detail-block">
            <div class="invitation-detail-label">LOCATION</div>
            <div class="invitation-detail-value">${data.details.location}</div>
          </div>
        </div>

        <!-- Thank You Section (pink – same style as Details/Welcome) -->
        <div class="invitation-section theme-navy perforated-top-navy perforated-bottom-navy invitation-thankyou-section">
          <div class="invitation-side-notch-left"></div>
          <div class="invitation-side-notch-right"></div>
          <div class="invitation-details-title">${data.thankyou.message}</div>
          <div class="invitation-thankyou-logo">
            <img src="${data.images.studio}" alt="Studio i" />
          </div>
        </div>

      </div>
    </div>
  `;

  container.innerHTML = html;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = renderTicket;
}
if (typeof window !== 'undefined') {
  window.renderTicket = renderTicket;
}
