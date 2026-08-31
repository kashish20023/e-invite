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

  // Build the HTML layout – we keep the original two‑column structure but replace wedding‑specific texts.
  const html = `
    <div class="invitation-layout">
      <!-- LEFT STRIP -->
      <div class="invitation-column">
        <div class="invitation-section theme-cream perforated-top-cream perforated-bottom-cream invitation-intro">
          <div class="invitation-side-notch-left"></div>
          <div class="invitation-side-notch-right"></div>
          <div class="invitation-intro-top-bar">
            <img src="${data.images.airplane}" class="invitation-airplane-icon" alt="Airplane" />
            <div class="invitation-header-title">${data.header.title}</div>
          </div>
          <div class="invitation-globe-wrapper">
            <img src="${data.images.globe}" alt="Globe" />
          </div>
        </div>

        <!-- Boarding Pass Info Strip -->
        <div class="invitation-section theme-cream perforated-top-cream perforated-bottom-cream invitation-boarding-info">
          <div class="invitation-side-notch-left"></div>
          <div class="invitation-side-notch-right"></div>

          <!-- Vertical stub label -->
          <div class="invitation-boarding-stub">EVENT</div>

          <!-- Boarding pass grid -->
          <div class="invitation-boarding-grid">

            <!-- Row 1: DATE | TIME -->
            <div class="invitation-bp-row">
              <div class="invitation-bp-cell">
                <div class="invitation-bp-label">DATE</div>
                <div class="invitation-bp-value">${displayDate}</div>
              </div>
              <div class="invitation-bp-vline"></div>
              <div class="invitation-bp-cell">
                <div class="invitation-bp-label">TIME</div>
                <div class="invitation-bp-value">${data.details.time}</div>
              </div>
            </div>

            <!-- Row 2: LOCATION | STAMP -->
            <div class="invitation-bp-row invitation-bp-row--stamp">
              <div class="invitation-bp-cell">
                <div class="invitation-bp-label">Location</div>
                <div class="invitation-bp-value">${data.details.location}</div>
              </div>
              <div class="invitation-bp-stamp-wrap">
                <img src="${data.images.stampSeal}" class="invitation-bp-stamp" alt="Stamp" />
              </div>
            </div>

            <!-- Tear-off dashed line -->
            <div class="invitation-bp-tearline">
              <div class="invitation-bp-tear-dot left"></div>
              <div class="invitation-bp-tear-dash"></div>
              <div class="invitation-bp-tear-dot right"></div>
            </div>

            <!-- Bottom title -->
            <div class="invitation-bp-title">${data.boarding.title}</div>

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
