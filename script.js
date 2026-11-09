// ================================
// SPACECARE PAGE NAVIGATION
// ================================

// All page sections available in the dashboard.
const pageNames = {
    overview: "Overview",
    "daily-check": "Daily Health Check",
    analytics: "Health Analytics",
    "body-map": "Human Body Map",
    alerts: "Alerts & Actions",
    wellness: "Sleep & Mental Wellness",
    guide: "Space Health Guide",
    routine: "Mission Routine",
    settings: "Settings"
};

function showPage(pageId) {
    const requestedPage = document.getElementById(pageId);

    // Stop if the requested page does not exist.
    if (!requestedPage || !requestedPage.classList.contains("page-section")) {
        return;
    }

    // Hide every page, then show only the selected one.
    document.querySelectorAll(".page-section").forEach((page) => {
        page.classList.remove("active");
    });
    requestedPage.classList.add("active");

    // Highlight the matching item in the sidebar.
    document.querySelectorAll(".menu-link").forEach((link) => {
        const linkPage = link.getAttribute("href")?.slice(1);
        link.classList.toggle("active", linkPage === pageId);
    });

    // Update the breadcrumb title.
    const breadcrumb = document.querySelector(".breadcrumb");
    if (breadcrumb) {
        breadcrumb.innerHTML = `SpaceCare <i class="fa-solid fa-chevron-right"></i> ${pageNames[pageId] || "Overview"}`;
    }

    // Close the mobile sidebar after choosing a page.
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("show");

    // Start the page from its top.
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Handle sidebar links and any in-page link that points to a page ID.
document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const pageId = link.getAttribute("href").slice(1);
    if (document.getElementById(pageId)?.classList.contains("page-section")) {
        event.preventDefault();
        showPage(pageId);
    } else if (link.getAttribute("href") === "#") {
        event.preventDefault();
    }
});

// Start Daily Check button.
document.getElementById("startCheck")?.addEventListener("click", () => {
    showPage("daily-check");
});

// Quick action buttons on the Overview page.
document.querySelectorAll(".action-button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
        const destinations = {
            check: "daily-check",
            alerts: "alerts",
            body: "body-map"
        };

        const action = button.dataset.action;
        if (destinations[action]) {
            showPage(destinations[action]);
        } else if (action === "measurement") {
            // Open the existing measurement modal for this action.
            document.getElementById("modalOverlay")?.classList.add("active");
        }
    });
});

// Mobile sidebar toggle.

// Close the demo banner.
document.getElementById("closeBanner")?.addEventListener("click", () => {
    document.querySelector(".demo-banner")?.remove();
});

// Close the measurement modal.
document.getElementById("modalClose")?.addEventListener("click", () => {
    document.getElementById("modalOverlay")?.classList.remove("active");
});

document.getElementById("modalOverlay")?.addEventListener("click", (event) => {
    if (event.target.id === "modalOverlay") {
        event.currentTarget.classList.remove("active");
    }
});

// ================================
// OVERVIEW HEALTH CHART (Chart.js)
// ================================

const ctx = document.getElementById("healthChart");

if (ctx && typeof Chart !== "undefined") {
    const healthChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "Heart Rate",
                data: [70, 74, 72, 76, 71, 73, 72],
                borderColor: "#36D6E7",
                backgroundColor: "rgba(54, 214, 231, 0.10)",
                borderWidth: 2.5,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: "#36D6E7"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "#94A3B8" },
                    border: { display: false }
                },
                y: {
                    grid: { color: "rgba(148, 163, 184, 0.10)" },
                    ticks: { color: "#94A3B8" },
                    border: { display: false }
                }
            }
        }
    });

    // Switch the Overview chart when one of its tabs is clicked.
    const chartData = {
        heart: { label: "Heart Rate", data: [70, 74, 72, 76, 71, 73, 72], value: "72", unit: "bpm · latest" },
        sleep: { label: "Sleep", data: [6.8, 7.2, 6.5, 7.8, 7.1, 8.0, 7.4], value: "7.4", unit: "hours · latest" },
        temperature: { label: "Temperature", data: [36.6, 36.7, 36.8, 36.7, 36.9, 36.8, 36.8], value: "36.8", unit: "°C · latest" }
    };

    document.querySelectorAll(".chart-tab[data-chart]").forEach((tab) => {
        tab.addEventListener("click", () => {
            const selected = chartData[tab.dataset.chart];
            if (!selected) return;

            document.querySelectorAll(".chart-tab").forEach((item) => item.classList.remove("active"));
            tab.classList.add("active");

            healthChart.data.datasets[0].label = selected.label;
            healthChart.data.datasets[0].data = selected.data;
            healthChart.update();

            const value = document.getElementById("chartValue");
            const unit = document.getElementById("chartUnit");
            if (value) value.textContent = selected.value;
            if (unit) unit.textContent = selected.unit;
        });
    });
}
