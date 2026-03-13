import React, { useState, useRef } from "react";

export default function App() {
  const [showCircle, setShowCircle] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [fadingOut, setFadingOut] = useState(false);
  const fadeTimeoutRef = React.useRef(null);
  const [circleClosing, setCircleClosing] = useState(false);
  const [circleOpening, setCircleOpening] = useState(false);
  const [circleOpeningDash, setCircleOpeningDash] = useState(false);
  const [animatingIcons, setAnimatingIcons] = useState(false);
  const [animatingTotal, setAnimatingTotal] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const posRef = useRef({ x: -100, y: -100 });
  const isInitialMountSubscriptions = useRef(true);
  const isInitialMountPrimary = useRef(true);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [yearlyView, setYearlyView] = useState(false);
  const [yearlyViewAnimating, setYearlyViewAnimating] = useState(false);
  const [yearChangeDirection, setYearChangeDirection] = useState("");
  const [showManagePanel, setShowManagePanel] = useState(false);
  const [showAddNewForm, setShowAddNewForm] = useState(false);
  const [iconInputMethod, setIconInputMethod] = useState("emoji");
  const [addFormClosing, setAddFormClosing] = useState(false);
  const [managePanelClosing, setManagePanelClosing] = useState(false);
  const [yearPickerClosing, setYearPickerClosing] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editPanelClosing, setEditPanelClosing] = useState(false);
  const [editingSubId, setEditingSubId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", amount: "", icon: "", day: "", color: "#E50914", since: "", url: "", currency: "€" });
  const [editIconMethod, setEditIconMethod] = useState("emoji");
  const [deletingSubId, setDeletingSubId] = useState(null);
  const [editFormError, setEditFormError] = useState("");
  const [showDeletedMessage, setShowDeletedMessage] = useState(false);
  const [showEditedMessage, setShowEditedMessage] = useState(false);

  const [newSubName, setNewSubName] = useState("");
  const [newSubAmount, setNewSubAmount] = useState("");
  const [newSubIcon, setNewSubIcon] = useState("");
  const [newSubDay, setNewSubDay] = useState("");
  const [newSubColor, setNewSubColor] = useState("#E50914");
  const [newSubSince, setNewSubSince] = useState("");
  const [newSubUrl, setNewSubUrl] = useState("");
  const [newSubCurrency, setNewSubCurrency] = useState("€");
  const [formError, setFormError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [primarySubsByDay, setPrimarySubsByDay] = useState({});
  const [showPrimarySelector, setShowPrimarySelector] = useState(null);
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);
  const [tooltipSlideDirection, setTooltipSlideDirection] = useState("");
  const [isTooltipTransitioning, setIsTooltipTransitioning] = useState(false);
  const [selectorAnimating, setSelectorAnimating] = useState(false);
  const [selectorClosing, setSelectorClosing] = useState(false);
  const [newPrimaryId, setNewPrimaryId] = useState(null);
  const [justSelected, setJustSelected] = useState(null);
  const [justSelectedPrimaryId, setJustSelectedPrimaryId] = useState(null);

  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: "Unknown",
      icon: "🌀",
      color: "#8B9DC3",
      day: 2,
      amount: 3.99,
      frequency: "Every 2nd",
      total: 47.88,
      since: "2022-03-01",
      url: undefined as string | undefined,
      currency: "€",
    },
    {
      id: 2,
      name: "Netflix",
      icon: "N",
      color: "#E50914",
      day: 7,
      amount: 15.99,
      frequency: "Every 7th",
      total: 191.88,
      since: "2022-01-01",
    },
    {
      id: 3,
      name: "Utilities",
      icon: "⚡",
      color: "#4ADE80",
      day: 11,
      amount: 5.5,
      frequency: "Every 11th",
      total: 66.0,
      since: "2022-06-01",
    },
    {
      id: 4,
      name: "Jet Brains",
      icon: "🔧",
      color: "#FFFFFF",
      day: 12,
      amount: 7.25,
      frequency: "Every 12th",
      total: 87.0,
      since: "2023-01-01",
    },
    {
      id: 5,
      name: "Spotify",
      icon: "♫",
      color: "#1DB954",
      day: 15,
      amount: 9.99,
      frequency: "Every 15th",
      total: 119.88,
      since: "2022-02-01",
    },
    {
      id: 6,
      name: "LinkedIn",
      icon: "in",
      color: "#0A66C2",
      day: 24,
      amount: 8.99,
      frequency: "Every 24th",
      total: 107.88,
      since: "2022-11-01",
    },
    {
      id: 7,
      name: "Monday",
      icon: "M",
      color: "#FF3D57",
      day: 27,
      amount: 12.5,
      frequency: "Every 27th",
      total: 150.0,
      since: "2022-05-01",
    },
    {
      id: 8,
      name: "Amazon",
      icon: "a",
      color: "#FF9900",
      day: 30,
      amount: 3.45,
      frequency: "Every 30th",
      total: 41.4,
      since: "2023-01-01",
    },
  ]);

  React.useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const result = await window.storage.get("subscriptions");
        if (result && result.value) {
          setSubscriptions(JSON.parse(result.value));
        }
      } catch (error) {
        console.log("No saved subscriptions found, using defaults");
      }
      try {
        const primaryResult = await window.storage.get("primarySubsByDay");
        if (primaryResult && primaryResult.value) {
          const loadedPrimary = JSON.parse(primaryResult.value);
          const numberKeyPrimary = {};
          for (const key in loadedPrimary) {
            numberKeyPrimary[Number(key)] = loadedPrimary[key];
          }
          setPrimarySubsByDay(numberKeyPrimary);
        }
      } catch (error) {
        console.log("No saved primary selections");
      }
    };
    loadSubscriptions();
  }, []);

  React.useEffect(() => {
    if (isInitialMountSubscriptions.current) {
      isInitialMountSubscriptions.current = false;
      return;
    }

    const saveSubscriptions = async () => {
      try {
        await window.storage.set(
          "subscriptions",
          JSON.stringify(subscriptions)
        );
      } catch (error) {
        console.error("Failed to save subscriptions:", error);
      }
    };
    if (subscriptions.length > 0) {
      saveSubscriptions();
    }
  }, [subscriptions]);

  React.useEffect(() => {
    if (isInitialMountPrimary.current) {
      isInitialMountPrimary.current = false;
      return;
    }

    const savePrimary = async () => {
      try {
        console.log("useEffect saving primary:", primarySubsByDay);
        await window.storage.set(
          "primarySubsByDay",
          JSON.stringify(primarySubsByDay)
        );
      } catch (error) {
        console.error("Failed to save primary selections:", error);
      }
    };

    // Only save if there's actual data
    if (Object.keys(primarySubsByDay).length > 0) {
      savePrimary();
    }
  }, [primarySubsByDay]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    let rafId: number;
    const updateCursor = () => {
      // Linear Interpolation (Lerp) - 0.15 is the smoothing factor
      const lerp = 0.15;
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * lerp;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const getCurrencySymbol = (currencyStr: string) => {
    if (!currencyStr) return "€";
    return currencyStr;
  };

  const normalizeUrl = (url: string) => {
    if (!url) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const totalSpend = subscriptions
    .reduce((sum, sub) => sum + sub.amount, 0)
    .toFixed(2);
  const primaryCurrency = (() => {
    const counts: Record<string, number> = {};
    subscriptions.forEach(sub => {
      const c = sub.currency || "€";
      counts[c] = (counts[c] || 0) + 1;
    });
    let max = 0, result = "€";
    for (const [c, n] of Object.entries(counts)) {
      if (n > max) { max = n; result = c; }
    }
    return result;
  })();
  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const getProportionalAngle = (amount) => (amount / totalAmount) * 360;

  const getDaysInMonth = () =>
    new Date(currentYear, currentMonth + 1, 0).getDate();
  const getFirstDayOfMonth = () =>
    new Date(currentYear, currentMonth, 1).getDay();
  const getMonthName = () =>
    [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][currentMonth];

  const getDaysInMonthForDate = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonthForDate = (year, month) =>
    new Date(year, month, 1).getDay();
  const getMonthNameByIndex = (index) =>
    [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][index];

  const getMonthlyTotal = (month, year) => {
    const daysInMonth = getDaysInMonthForDate(year, month);
    let total = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const daySubs = subscriptions.filter((sub) => {
        if (Math.min(sub.day, daysInMonth) !== day) return false;
        const startDate = new Date(sub.since);
        return currentDate >= startDate;
      });
      daySubs.forEach((sub) => {
        total += sub.amount;
      });
    }
    return total;
  };

  const getSubscriptionsForDate = (day) => {
    const currentDate = new Date(currentYear, currentMonth, day);
    return subscriptions.filter((sub) => {
      if (Math.min(sub.day, getDaysInMonth()) !== day) return false;
      const startDate = new Date(sub.since);
      return currentDate >= startDate;
    });
  };

  const getSubscriptionForDate = (day) => {
    const subs = getSubscriptionsForDate(day);
    if (subs.length === 0) return null;
    if (subs.length === 1) return subs[0];
    const primaryId = primarySubsByDay[day];
    const primary = subs.find((s) => s.id === primaryId);
    return primary || subs[0];
  };

  const renderSubscriptionIcon = (sub) => {
    // Handle favicon-based icons
    if (sub.icon && sub.icon.startsWith("favicon:")) {
      const domain = sub.icon.replace("favicon:", "");
      return (
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
          alt={sub.name}
          className="rounded"
          style={{ width: "28px", height: "28px", objectFit: "contain" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            (e.target as HTMLImageElement).insertAdjacentHTML("afterend", '<span class="text-2xl">🌐</span>');
          }}
        />
      );
    }

    if (sub.icon === "N")
      return <span className="text-red-600 font-bold text-3xl">N</span>;
    if (sub.icon === "in")
      return <span className="text-blue-600 font-bold text-2xl">in</span>;
    if (sub.icon === "a")
      return <span className="text-orange-500 font-bold text-3xl">a</span>;
    if (sub.icon === "M")
      return <span className="text-pink-500 font-bold text-3xl">M</span>;

    const emojiRegex =
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1F004}-\u{1F0CF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}\u{1F170}-\u{1F251}]/u;
    const isEmoji = emojiRegex.test(sub.icon);

    if (!isEmoji && sub.icon && sub.icon.length <= 2) {
      return (
        <span className="font-bold text-3xl" style={{ color: sub.color }}>
          {sub.icon}
        </span>
      );
    }

    return <span className="text-3xl">{sub.icon}</span>;
  };

  const daysInMonth = getDaysInMonth();
  const firstDay = getFirstDayOfMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const goToPreviousMonth = () => {
    if (isTransitioning || yearlyView) return;
    setIsTransitioning(true);
    setSlideDirection("right");
    setTimeout(() => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
      setSlideDirection("");
      setIsTransitioning(false);
    }, 500);
  };

  const goToNextMonth = () => {
    if (isTransitioning || yearlyView) return;
    setIsTransitioning(true);
    setSlideDirection("left");
    setTimeout(() => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
      setSlideDirection("");
      setIsTransitioning(false);
    }, 500);
  };

  const toggleYearlyView = () => {
    setYearlyViewAnimating(true);
    setTimeout(() => {
      setYearlyView(!yearlyView);
      setYearlyViewAnimating(false);
    }, 300);
  };

  const goToMonthFromYearly = (monthIndex) => {
    setYearlyViewAnimating(true);
    setTimeout(() => {
      setCurrentMonth(monthIndex);
      setYearlyView(false);
      setYearlyViewAnimating(false);
    }, 300);
  };

  const handleCloseCircle = () => {
    console.log(
      "=== CLOSING CIRCLE - justSelectedPrimaryId is:",
      justSelectedPrimaryId
    );
    // Phase 1: Arcs shrink (0.8s)
    setCircleClosing(true);
    // Fade out center text smoothly
    setTimeout(() => {
      setAnimatingTotal(true);
    }, 50);
    // Phase 2: After arcs finish shrinking, icons fly back to calendar (0.4s)
    setTimeout(() => {
      setAnimatingIcons(true);
      // Phase 3: After icons finish flying back, clean up
      setTimeout(() => {
        setShowCircle(false);
        setCircleClosing(false);
        setAnimatingIcons(false);
        setAnimatingTotal(false);
        setTimeout(() => {
          setJustSelectedPrimaryId(null);
        }, 100);
      }, 500);
    }, 800);
  };

  const handleOpenCircle = () => {
    // Phase 1: Show circle, icons fly from calendar to circle positions (0.4s)
    setShowCircle(true);
    setCircleOpening(true);
    setCircleOpeningDash(true);
    setAnimatingIcons(true);
    setAnimatingTotal(true);
    // Phase 2: After icons land (0.4s), start arc expansion (0.8s)
    setTimeout(() => {
      setAnimatingIcons(false);
      // Start the arc expansion
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCircleOpeningDash(false);
        });
      });
      // Phase 3: After arcs finish expanding (0.8s more), show total text
      setTimeout(() => {
        setCircleOpening(false);
        setAnimatingTotal(false);
      }, 900);
    }, 450);
  };

  const handleAddSubscription = () => {
    if (!newSubName.trim()) {
      setFormError("Please enter a name");
      return;
    }
    if (!newSubAmount || parseFloat(newSubAmount) <= 0) {
      setFormError("Please enter a valid amount");
      return;
    }
    if (!newSubIcon.trim()) {
      setFormError("Please select or enter an icon");
      return;
    }
    if (!newSubDay || parseInt(newSubDay) < 1 || parseInt(newSubDay) > 31) {
      setFormError("Please enter a valid day (1-31)");
      return;
    }
    if (!newSubSince) {
      setFormError("Please select a start date");
      return;
    }

    const newId = Math.max(...subscriptions.map((s) => s.id), 0) + 1;
    const day = parseInt(newSubDay);
    const amount = parseFloat(newSubAmount);
    const getSuffix = (d) => {
      if (d === 1 || d === 21 || d === 31) return "st";
      if (d === 2 || d === 22) return "nd";
      if (d === 3 || d === 23) return "rd";
      return "th";
    };

    const startDate = new Date(newSubSince);
    const now = new Date();
    const monthsSince =
      (now.getFullYear() - startDate.getFullYear()) * 12 +
      (now.getMonth() - startDate.getMonth());
    const totalAmount = Math.max(0, monthsSince) * amount;

    setSubscriptions([
      ...subscriptions,
      {
        id: newId,
        name: newSubName,
        icon: newSubIcon,
        color: newSubColor,
        day: day,
        amount: amount,
        frequency: `Every ${day}${getSuffix(day)}`,
        total: totalAmount,
        since: newSubSince,
        url: newSubUrl.trim() || undefined,
        currency: newSubCurrency,
      },
    ]);

    setNewSubName("");
    setNewSubAmount("");
    setNewSubIcon("");
    setNewSubDay("");
    setNewSubColor("#E50914");
    setNewSubSince("");
    setNewSubUrl("");
    setNewSubCurrency("€");
    setFormError("");
    setAddFormClosing(true);

    setTimeout(() => {
      setShowAddNewForm(false);
      setAddFormClosing(false);
      setManagePanelClosing(true);
      setTimeout(() => {
        setShowManagePanel(false);
        setManagePanelClosing(false);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }, 300);
    }, 300);
  };

  const handleStartEdit = (sub) => {
    setEditingSubId(sub.id);
    setEditForm({
      name: sub.name,
      amount: sub.amount.toString(),
      icon: sub.icon,
      day: sub.day.toString(),
      color: sub.color,
      since: sub.since,
      url: sub.url || "",
      currency: sub.currency || "€",
    });
    setEditFormError("");
    // Detect icon type for the toggle
    if (sub.icon && sub.icon.startsWith("favicon:")) {
      setEditIconMethod("link");
    } else {
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1F004}-\u{1F0CF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}\u{1F170}-\u{1F251}]/u;
      if (emojiRegex.test(sub.icon)) {
        setEditIconMethod("emoji");
      } else {
        setEditIconMethod("letter");
      }
    }
  };

  const handleSaveEdit = () => {
    if (!editForm.name.trim()) { setEditFormError("Please enter a name"); return; }
    if (!editForm.amount || parseFloat(editForm.amount) <= 0) { setEditFormError("Please enter a valid amount"); return; }
    if (!editForm.icon.trim()) { setEditFormError("Please select or enter an icon"); return; }
    if (!editForm.day || parseInt(editForm.day) < 1 || parseInt(editForm.day) > 31) { setEditFormError("Please enter a valid day (1-31)"); return; }
    if (!editForm.since) { setEditFormError("Please select a start date"); return; }

    const day = parseInt(editForm.day);
    const amount = parseFloat(editForm.amount);
    const getSuffix = (d) => {
      if (d === 1 || d === 21 || d === 31) return "st";
      if (d === 2 || d === 22) return "nd";
      if (d === 3 || d === 23) return "rd";
      return "th";
    };
    const startDate = new Date(editForm.since);
    const now = new Date();
    const monthsSince = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
    const totalAmount = Math.max(0, monthsSince) * amount;

    setSubscriptions(subscriptions.map((s) =>
      s.id === editingSubId
        ? {
            ...s,
            name: editForm.name,
            icon: editForm.icon,
            color: editForm.color,
            day: day,
            amount: amount,
            frequency: `Every ${day}${getSuffix(day)}`,
            total: totalAmount,
            since: editForm.since,
            url: editForm.url.trim() || undefined,
            currency: editForm.currency,
          }
        : s
    ));
    setEditingSubId(null);
    setEditFormError("");
    setShowEditedMessage(true);
    setTimeout(() => setShowEditedMessage(false), 3000);
  };

  const handleDeleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
    // Clean up primarySubsByDay entries that reference this subscription
    const updatedPrimary = { ...primarySubsByDay };
    for (const key in updatedPrimary) {
      if (updatedPrimary[key] === id) {
        delete updatedPrimary[key];
      }
    }
    setPrimarySubsByDay(updatedPrimary);
    setDeletingSubId(null);
    setShowDeletedMessage(true);
    setTimeout(() => setShowDeletedMessage(false), 3000);
  };

  return (
    <div
      className="min-h-screen bg-black text-white p-8 flex items-center justify-center"
      style={{ cursor: "none" }}
    >
      <style>{`
        *, *::before, *::after { cursor: none !important; }
        body { cursor: none !important; }
        @keyframes slideOutLeft { 0% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(-100%); opacity: 0; } }
        @keyframes slideOutRight { 0% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(100%); opacity: 0; } }
        @keyframes slideIn { 0% { transform: translateX(0); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        @keyframes flipUp { 0% { transform: perspective(1000px) rotateX(0deg); opacity: 1; } 50% { transform: perspective(1000px) rotateX(90deg); opacity: 0; } 51% { transform: perspective(1000px) rotateX(-90deg); opacity: 0; } 100% { transform: perspective(1000px) rotateX(0deg); opacity: 1; } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes popupModal { 0% { transform: scale(0.7); opacity: 0; } 50% { transform: scale(1.02); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes popupModalClose { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(0.7); opacity: 0; } }
        @keyframes fadeOut { 0% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes popup { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes popupCentered { 0% { transform: translateX(-50%) scale(0.3); opacity: 0; } 50% { transform: translateX(-50%) scale(1.05); } 100% { transform: translateX(-50%) scale(1); opacity: 1; } }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes fade-out { 0% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes tooltipSlideOutLeft { 0% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(-30px); opacity: 0; } }
        @keyframes tooltipSlideOutRight { 0% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(30px); opacity: 0; } }
        @keyframes tooltipSlideIn { 0% { opacity: 0; } 100% { opacity: 1; } }
      `}</style>

      <div
        ref={cursorRef}
        className="fixed pointer-events-none"
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(-100px, -100px, 0) translate(-50%, -50%)`,
          zIndex: 99999,
        }}
      >
        <div
          className="w-12 h-12 rounded-full bg-gray-500"
          style={{
            opacity: 0.3,
            transition: "opacity 0.2s ease-out",
          }}
        />
      </div>

      <div className="max-w-4xl w-full relative">
        {showSuccessMessage && (
          <div
            className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3"
            style={{
              animation:
                "popupModal 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), fadeOut 0.3s ease-out 2.7s forwards",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              style={{
                filter: "drop-shadow(0 0 3px black) drop-shadow(0 0 6px black)",
              }}
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span
              className="font-bold text-2xl text-white"
              style={{
                textShadow:
                  "0 0 4px black, 0 0 8px black, 0 0 12px black, 2px 2px 4px black",
              }}
            >
              Subscription added!
            </span>
          </div>
        )}

        {showDeletedMessage && (
          <div
            className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3"
            style={{
              animation:
                "popupModal 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), fadeOut 0.3s ease-out 2.7s forwards",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"
              style={{ filter: "drop-shadow(0 0 3px black) drop-shadow(0 0 6px black)" }}>
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="font-bold text-2xl text-white"
              style={{ textShadow: "0 0 4px black, 0 0 8px black, 0 0 12px black, 2px 2px 4px black" }}>
              Subscription deleted!
            </span>
          </div>
        )}

        {showEditedMessage && (
          <div
            className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3"
            style={{
              animation:
                "popupModal 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), fadeOut 0.3s ease-out 2.7s forwards",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"
              style={{ filter: "drop-shadow(0 0 3px black) drop-shadow(0 0 6px black)" }}>
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="font-bold text-2xl text-white"
              style={{ textShadow: "0 0 4px black, 0 0 8px black, 0 0 12px black, 2px 2px 4px black" }}>
              Subscription updated!
            </span>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousMonth}
              className="text-gray-400 hover:text-white transition-colors p-2"
              style={{
                opacity: yearlyView ? 0.3 : 1,
                pointerEvents: yearlyView ? "none" : "auto",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-4xl font-bold text-gray-300">
              {!yearlyView && getMonthName()}
              {yearlyView ? "" : " "}
              <span
                className="hover:text-white transition-colors"
                onClick={() => setShowYearPicker(!showYearPicker)}
              >
                {currentYear}
              </span>
              <button
                onClick={toggleYearlyView}
                className="ml-4 text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 text-xl align-middle"
                title={
                  yearlyView
                    ? "Switch to monthly view"
                    : "Switch to yearly view"
                }
              >
                {yearlyView ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="7" height="7" rx="1" />
                    <rect x="14" y="4" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                )}
              </button>
            </h1>
            <button
              onClick={goToNextMonth}
              className="text-gray-400 hover:text-white transition-colors p-2"
              style={{
                opacity: yearlyView ? 0.3 : 1,
                pointerEvents: yearlyView ? "none" : "auto",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={handleOpenCircle}
              className="text-right hover:opacity-80 transition-opacity"
            >
              <div
                style={{
                  opacity: showCircle || animatingTotal ? 0 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <div className="text-sm text-gray-400">
                  {yearlyView ? "Annual" : "Monthly"} spend
                </div>
                <div className="text-3xl font-bold">
                  {primaryCurrency}
                  {yearlyView
                    ? (
                        subscriptions.reduce(
                          (sum, sub) => sum + sub.amount,
                          0
                        ) * 12
                      ).toFixed(2)
                    : totalSpend}
                </div>
              </div>
            </button>
            <div
              className="text-xs text-gray-500 flex items-center gap-1"
              style={{
                opacity: showCircle || animatingTotal ? 0 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <button
                className="text-gray-400 hover:text-white transition-colors px-1"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setShowManagePanel(true);
                }}
                style={{ background: "none", border: "none", padding: 0 }}
              >
                Manage
              </button>
              <span className="text-gray-400">•</span>
              <span>Click to open</span>
            </div>
          </div>
        </div>

        {showYearPicker && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
            onClick={() => {
              setYearPickerClosing(true);
              setTimeout(() => {
                setShowYearPicker(false);
                setYearPickerClosing(false);
              }, 300);
            }}
            style={{
              animation: yearPickerClosing
                ? "fadeOut 0.3s ease-out"
                : "fadeIn 0.2s ease-out",
            }}
          >
            <div
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700"
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: yearPickerClosing
                  ? "popupModalClose 0.3s cubic-bezier(0.6, 0, 0.8, 0.4) forwards"
                  : "popupModal 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-center flex-1">
                  Select Year
                </h2>
                <button
                  onClick={() => {
                    setYearPickerClosing(true);
                    setTimeout(() => {
                      setShowYearPicker(false);
                      setYearPickerClosing(false);
                    }, 300);
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-xl w-8 h-8 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {Array.from(
                  { length: 20 },
                  (_, i) => today.getFullYear() - 10 + i
                ).map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      if (year !== currentYear) {
                        setYearPickerClosing(true);
                        setTimeout(() => {
                          setShowYearPicker(false);
                          setYearPickerClosing(false);
                        }, 300);
                        setTimeout(() => {
                          setYearChangeDirection("up");
                          setIsTransitioning(true);
                          setTimeout(() => {
                            setCurrentYear(year);
                            setYearChangeDirection("");
                            setIsTransitioning(false);
                          }, 400);
                        }, 500);
                      } else {
                        setYearPickerClosing(true);
                        setTimeout(() => {
                          setShowYearPicker(false);
                          setYearPickerClosing(false);
                        }, 300);
                      }
                    }}
                    className={`p-3 rounded-lg transition-colors ${
                      year === currentYear
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showManagePanel && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
            onClick={() => {
              setManagePanelClosing(true);
              setTimeout(() => {
                setShowManagePanel(false);
                setManagePanelClosing(false);
              }, 300);
            }}
            style={{
              animation: managePanelClosing
                ? "fadeOut 0.3s ease-out"
                : "fadeIn 0.2s ease-out",
            }}
          >
            <div
              className="bg-gray-900 rounded-2xl p-8 max-w-xl w-full border border-gray-700"
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: managePanelClosing
                  ? "popupModalClose 0.3s cubic-bezier(0.6, 0, 0.8, 0.4) forwards"
                  : "popupModal 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex-1"></div>
                <h2 className="text-3xl font-bold text-center">
                  Manage Subscriptions
                </h2>
                <div className="flex-1 flex justify-end">
                  <button
                    onClick={() => {
                      setManagePanelClosing(true);
                      setTimeout(() => {
                        setShowManagePanel(false);
                        setManagePanelClosing(false);
                      }, 300);
                    }}
                    className="text-gray-400 hover:text-white transition-colors text-2xl w-10 h-10 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => setShowAddNewForm(true)}
                  className="bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center gap-4 border-2 border-gray-600"
                  style={{ minHeight: "200px" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.borderColor = "#9CA3AF";
                    e.currentTarget.style.boxShadow =
                      "0 0 30px rgba(156, 163, 175, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor = "#4B5563";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="text-6xl">+</div>
                  <div className="text-xl font-bold">Add New</div>
                  <div className="text-sm opacity-80">
                    Create a subscription
                  </div>
                </button>
                <button
                  onClick={() => {
                    setManagePanelClosing(true);
                    setTimeout(() => {
                      setShowManagePanel(false);
                      setManagePanelClosing(false);
                      setShowEditPanel(true);
                    }, 300);
                  }}
                  className="bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center gap-4 border-2 border-gray-600"
                  style={{ minHeight: "200px" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.borderColor = "#9CA3AF";
                    e.currentTarget.style.boxShadow =
                      "0 0 30px rgba(156, 163, 175, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor = "#4B5563";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <div className="text-xl font-bold">Edit Subscriptions</div>
                  <div className="text-sm opacity-80">Modify or delete</div>
                </button>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
                {subscriptions.length} active subscription
                {subscriptions.length !== 1 ? "s" : ""} • {primaryCurrency}{totalSpend}/month
              </div>
            </div>
          </div>
        )}

        {showAddNewForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setAddFormClosing(true);
              setTimeout(() => {
                setShowAddNewForm(false);
                setAddFormClosing(false);
              }, 300);
            }}
            style={{
              animation: addFormClosing
                ? "fadeOut 0.3s ease-out"
                : "fadeIn 0.2s ease-out",
            }}
          >
            <div
              className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full border border-gray-700 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: addFormClosing
                  ? "popupModalClose 0.3s cubic-bezier(0.6, 0, 0.8, 0.4) forwards"
                  : "popupModal 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex-1"></div>
                <h2 className="text-2xl font-bold text-center">
                  Add New Subscription
                </h2>
                <div className="flex-1 flex justify-end">
                  <button
                    onClick={() => {
                      setAddFormClosing(true);
                      setTimeout(() => {
                        setShowAddNewForm(false);
                        setAddFormClosing(false);
                      }, 300);
                    }}
                    className="text-gray-400 hover:text-white transition-colors text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {formError && (
                  <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg px-4 py-3 text-red-200 text-sm">
                    {formError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Netflix, Spotify, etc."
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="15.99"
                      value={newSubAmount}
                      onChange={(e) => setNewSubAmount(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={newSubCurrency}
                      onChange={(e) => {
                        const val = e.target.value;
                        const symbol = val.split(" ")[0];
                        setNewSubCurrency(symbol);
                      }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500">
                      <option value="€">€ EUR</option>
                      <option value="$">$ USD</option>
                      <option value="£">£ GBP</option>
                      <option value="¥">¥ JPY</option>
                      <option value="₹">₹ INR</option>
                      <option value="Fr">Fr CHF</option>
                      <option value="kr">kr SEK</option>
                      <option value="R$">R$ BRL</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Icon
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setIconInputMethod("emoji")}
                      className={`flex-1 py-2 rounded-lg transition-colors text-sm ${
                        iconInputMethod === "emoji"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      Emoji
                    </button>
                    <button
                      onClick={() => setIconInputMethod("preset")}
                      className={`flex-1 py-2 rounded-lg transition-colors text-sm ${
                        iconInputMethod === "preset"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      Preset
                    </button>
                    <button
                      onClick={() => setIconInputMethod("letter")}
                      className={`flex-1 py-2 rounded-lg transition-colors text-sm ${
                        iconInputMethod === "letter"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      Custom
                    </button>
                    <button
                      onClick={() => setIconInputMethod("link")}
                      className={`flex-1 py-2 rounded-lg transition-colors text-sm ${
                        iconInputMethod === "link"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      Link
                    </button>
                  </div>
                  {iconInputMethod === "emoji" && (
                    <input
                      type="text"
                      placeholder="e.g. 🎵 📺 💰"
                      maxLength={2}
                      value={newSubIcon}
                      onChange={(e) => {
                        const value = e.target.value;
                        const emojiRegex =
                          /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1F004}-\u{1F0CF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}\u{1F170}-\u{1F251}]/gu;
                        const emojis = value.match(emojiRegex);
                        setNewSubIcon(
                          emojis ? emojis.join("").slice(0, 2) : ""
                        );
                      }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                    />
                  )}
                  {iconInputMethod === "preset" && (
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        "🎵",
                        "📺",
                        "🎮",
                        "☁️",
                        "💻",
                        "📱",
                        "🎬",
                        "🏋️",
                        "🍔",
                        "🚗",
                        "✈️",
                        "🏠",
                      ].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setNewSubIcon(emoji)}
                          className={`bg-gray-800 hover:bg-gray-700 hover:border-gray-500 hover:scale-110 border rounded-lg p-3 text-2xl transition-all duration-200 ${
                            newSubIcon === emoji
                              ? "border-blue-500 bg-gray-700"
                              : "border-gray-700"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                  {iconInputMethod === "letter" && (
                    <input
                      type="text"
                      placeholder="e.g. N, YT, $, ★"
                      maxLength={2}
                      value={newSubIcon}
                      onChange={(e) => setNewSubIcon(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                    />
                  )}
                  {iconInputMethod === "link" && (
                    <div>
                      <input
                        type="url"
                        placeholder="https://netflix.com"
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          if (value) {
                            try {
                              const url = new URL(value.startsWith("http") ? value : `https://${value}`);
                              setNewSubIcon(`favicon:${url.hostname}`);
                            } catch {
                              setNewSubIcon("");
                            }
                          } else {
                            setNewSubIcon("");
                          }
                        }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                      />
                      {newSubIcon && newSubIcon.startsWith("favicon:") && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${newSubIcon.replace("favicon:", "")}&sz=64`}
                            alt="Preview"
                            className="rounded"
                            style={{ width: "24px", height: "24px" }}
                          />
                          <span>Favicon preview</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className="grid gap-4"
                  style={{ gridTemplateColumns: "2fr 2fr 1fr" }}
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Day
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      placeholder="15"
                      value={newSubDay}
                      onChange={(e) => {
                        let v = e.target.value;
                        if (v === "") {
                          setNewSubDay("");
                          return;
                        }
                        if (!/^\d+$/.test(v)) return;
                        let n = parseInt(v);
                        if (isNaN(n)) return;
                        if (n < 1) n = 1;
                        if (n > 31) n = 31;
                        setNewSubDay(n.toString());
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") return;
                        let n = parseInt(e.target.value);
                        if (n < 1) setNewSubDay("1");
                        if (n > 31) setNewSubDay("31");
                      }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Since
                    </label>
                    <input
                      type="date"
                      value={newSubSince}
                      onChange={(e) => setNewSubSince(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      value={newSubColor}
                      onChange={(e) => setNewSubColor(e.target.value)}
                      className="w-full h-10 bg-gray-800 border border-gray-700 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Website URL <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://netflix.com/account"
                    value={newSubUrl}
                    onChange={(e) => setNewSubUrl(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setAddFormClosing(true);
                      setFormError("");
                      setNewSubName("");
                      setNewSubAmount("");
                      setNewSubIcon("");
                      setNewSubDay("");
                      setNewSubSince("");
                      setNewSubColor("#E50914");
                      setNewSubUrl("");
                      setTimeout(() => {
                        setShowAddNewForm(false);
                        setAddFormClosing(false);
                      }, 300);
                    }}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSubscription}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Add Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditPanel && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setEditPanelClosing(true);
              setTimeout(() => {
                setShowEditPanel(false);
                setEditPanelClosing(false);
                setEditingSubId(null);
                setDeletingSubId(null);
                setEditFormError("");
              }, 300);
            }}
            style={{
              animation: editPanelClosing
                ? "fadeOut 0.3s ease-out"
                : "fadeIn 0.2s ease-out",
            }}
          >
            <div
              className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full border border-gray-700 max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: editPanelClosing
                  ? "popupModalClose 0.3s cubic-bezier(0.6, 0, 0.8, 0.4) forwards"
                  : "popupModal 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex-1"></div>
                <h2 className="text-2xl font-bold text-center">
                  Edit Subscriptions
                </h2>
                <div className="flex-1 flex justify-end">
                  <button
                    onClick={() => {
                      setEditPanelClosing(true);
                      setTimeout(() => {
                        setShowEditPanel(false);
                        setEditPanelClosing(false);
                        setEditingSubId(null);
                        setDeletingSubId(null);
                        setEditFormError("");
                      }, 300);
                    }}
                    className="text-gray-400 hover:text-white transition-colors text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 space-y-3 pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#4B5563 transparent" }}>
                {subscriptions.length === 0 && (
                  <div className="text-center text-gray-500 py-12">
                    <div className="text-4xl mb-3">📭</div>
                    <div className="text-lg">No subscriptions yet</div>
                  </div>
                )}
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    {/* Delete confirmation overlay */}
                    {deletingSubId === sub.id ? (
                      <div className="p-5" style={{ animation: "fadeIn 0.15s ease-out" }}>
                        <div className="text-center mb-4">
                          <div className="text-lg font-semibold mb-1">Delete {sub.name}?</div>
                          <div className="text-sm text-gray-400">This action cannot be undone.</div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setDeletingSubId(null)}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteSubscription(sub.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : editingSubId === sub.id ? (
                      /* Inline edit form */
                      <div className="p-5 space-y-4" style={{ animation: "fadeIn 0.15s ease-out" }}>
                        {editFormError && (
                          <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg px-4 py-3 text-red-200 text-sm">
                            {editFormError}
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Amount</label>
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.amount}
                              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Currency</label>
                            <select
                              value={editForm.currency}
                              onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
                              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500">
                              <option value="€">€ EUR</option>
                              <option value="$">$ USD</option>
                              <option value="£">£ GBP</option>
                              <option value="¥">¥ JPY</option>
                              <option value="₹">₹ INR</option>
                              <option value="Fr">Fr CHF</option>
                              <option value="kr">kr SEK</option>
                              <option value="R$">R$ BRL</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Day</label>
                            <input
                              type="number"
                              min="1"
                              max="31"
                              value={editForm.day}
                              onChange={(e) => {
                                let v = e.target.value;
                                if (v === "") { setEditForm({ ...editForm, day: "" }); return; }
                                if (!/^\d+$/.test(v)) return;
                                let n = parseInt(v);
                                if (n < 1) n = 1;
                                if (n > 31) n = 31;
                                setEditForm({ ...editForm, day: n.toString() });
                              }}
                              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Icon</label>
                          <div className="flex gap-2 mb-3">
                            <button
                              onClick={() => setEditIconMethod("emoji")}
                              className={`flex-1 py-2 rounded-lg transition-colors text-sm ${editIconMethod === "emoji" ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-400"}`}
                            >Emoji</button>
                            <button
                              onClick={() => setEditIconMethod("preset")}
                              className={`flex-1 py-2 rounded-lg transition-colors text-sm ${editIconMethod === "preset" ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-400"}`}
                            >Preset</button>
                            <button
                              onClick={() => setEditIconMethod("letter")}
                              className={`flex-1 py-2 rounded-lg transition-colors text-sm ${editIconMethod === "letter" ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-400"}`}
                            >Custom</button>
                            <button
                              onClick={() => setEditIconMethod("link")}
                              className={`flex-1 py-2 rounded-lg transition-colors text-sm ${editIconMethod === "link" ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-400"}`}
                            >Link</button>
                          </div>
                          {editIconMethod === "emoji" && (
                            <input
                              type="text"
                              placeholder="e.g. 🎵 📺 💰"
                              maxLength={2}
                              value={editForm.icon}
                              onChange={(e) => {
                                const value = e.target.value;
                                const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1F004}-\u{1F0CF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}\u{1F170}-\u{1F251}]/gu;
                                const emojis = value.match(emojiRegex);
                                setEditForm({ ...editForm, icon: emojis ? emojis.join("").slice(0, 2) : "" });
                              }}
                              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                            />
                          )}
                          {editIconMethod === "preset" && (
                            <div className="grid grid-cols-6 gap-2">
                              {["🎵", "📺", "🎮", "☁️", "💻", "📱", "🎬", "🏋️", "🍔", "🚗", "✈️", "🏠"].map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => setEditForm({ ...editForm, icon: emoji })}
                                  className={`bg-gray-900 hover:bg-gray-700 hover:border-gray-500 hover:scale-110 border rounded-lg p-3 text-2xl transition-all duration-200 ${editForm.icon === emoji ? "border-blue-500 bg-gray-700" : "border-gray-700"}`}
                                >{emoji}</button>
                              ))}
                            </div>
                          )}
                          {editIconMethod === "letter" && (
                            <input
                              type="text"
                              placeholder="e.g. N, YT, $, ★"
                              maxLength={2}
                              value={editForm.icon}
                              onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                            />
                          )}
                          {editIconMethod === "link" && (
                            <div>
                              <input
                                type="url"
                                placeholder="https://netflix.com"
                                defaultValue={editForm.icon.startsWith("favicon:") ? editForm.icon.replace("favicon:", "https://") : ""}
                                onChange={(e) => {
                                  const value = e.target.value.trim();
                                  if (value) {
                                    try {
                                      const url = new URL(value.startsWith("http") ? value : `https://${value}`);
                                      setEditForm({ ...editForm, icon: `favicon:${url.hostname}` });
                                    } catch {
                                      setEditForm({ ...editForm, icon: "" });
                                    }
                                  } else {
                                    setEditForm({ ...editForm, icon: "" });
                                  }
                                }}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                              />
                              {editForm.icon && editForm.icon.startsWith("favicon:") && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                                  <img
                                    src={`https://www.google.com/s2/favicons?domain=${editForm.icon.replace("favicon:", "")}&sz=64`}
                                    alt="Preview"
                                    className="rounded"
                                    style={{ width: "24px", height: "24px" }}
                                  />
                                  <span>Favicon preview</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Website URL <span className="text-gray-500 font-normal">(optional)</span></label>
                          <input
                            type="url"
                            placeholder="https://netflix.com/account"
                            value={editForm.url}
                            onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Since</label>
                            <input
                              type="date"
                              value={editForm.since}
                              onChange={(e) => setEditForm({ ...editForm, since: e.target.value })}
                              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Color</label>
                            <input
                              type="color"
                              value={editForm.color}
                              onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                              className="w-full h-10 bg-gray-900 border border-gray-700 rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => { setEditingSubId(null); setEditFormError(""); }}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
                          >Cancel</button>
                          <button
                            onClick={handleSaveEdit}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                          >Save Changes</button>
                        </div>
                      </div>
                    ) : (
                      /* Normal row display */
                      <div className="p-4 flex items-center gap-4">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                          style={{ backgroundColor: sub.color + "22", border: `2px solid ${sub.color}` }}
                        >
                          {renderSubscriptionIcon({ ...sub, icon: sub.icon })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate">{sub.name}</div>
                          <div className="text-sm text-gray-400">{sub.currency || "€"}{sub.amount.toFixed(2)} • {sub.frequency}</div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleStartEdit(sub)}
                            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
                            title="Edit"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeletingSubId(sub.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-gray-700"
                            title="Delete"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
                {subscriptions.length} subscription{subscriptions.length !== 1 ? "s" : ""} • {primaryCurrency}{totalSpend}/month
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-7 gap-3 mb-3">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div
              key={day}
              className="text-center text-xs text-gray-500 font-semibold py-2 bg-gray-800 rounded-full"
            >
              {day}
            </div>
          ))}
        </div>

        <div
          className="grid grid-cols-7 gap-3 relative"
          style={{
            animation:
              slideDirection === "left"
                ? "slideOutLeft 0.5s ease-out forwards"
                : slideDirection === "right"
                ? "slideOutRight 0.5s ease-out forwards"
                : yearChangeDirection === "up"
                ? "flipUp 0.4s ease-out forwards"
                : !slideDirection && !yearChangeDirection
                ? "slideIn 0.5s ease-out"
                : "none",
            opacity: slideDirection || yearChangeDirection ? 0 : 1,
          }}
        >
          {emptyDays.map((i) => (
            <div key={`empty-${i}`} className="h-24" />
          ))}
          {days.map((day) => {
            const allSubs = getSubscriptionsForDate(day);
            const sub = getSubscriptionForDate(day);
            const hasMultiple = allSubs.length > 1;
            const isHovered = hoveredDate === day;
            const dayOfWeek = (firstDay + day - 1) % 7;
            const weekNumber = Math.floor((firstDay + day - 1) / 7);
            const totalWeeks = Math.ceil((firstDay + daysInMonth) / 7);
            const isRightEdge = dayOfWeek >= 5;
            const isLeftEdge = dayOfWeek <= 1;
            const isBottomEdge = weekNumber >= totalWeeks - 2;

            let tooltipClass =
              "absolute z-20 bg-gray-800 border-2 rounded-xl px-6 py-4 shadow-lg";
            let tooltipStyle: React.CSSProperties = {
              borderColor: allSubs[currentTooltipIndex]?.color || sub?.color,
              minWidth: "360px",
              width: "max-content",
            };
            let isCentered = false;

            if (isBottomEdge) {
              tooltipClass += " bottom-full mb-2";
              if (isRightEdge) tooltipClass += " right-0";
              else if (isLeftEdge) tooltipClass += " left-0";
              else {
                tooltipClass += " left-1/2";
                tooltipStyle.transform = "translateX(-50%)";
                isCentered = true;
              }
            } else {
              tooltipClass += " top-full mt-2";
              if (isRightEdge) tooltipClass += " right-0";
              else if (isLeftEdge) tooltipClass += " left-0";
              else {
                tooltipClass += " left-1/2";
                tooltipStyle.transform = "translateX(-50%)";
                isCentered = true;
              }
            }

            const reorderedSubs = hasMultiple
              ? [sub, ...allSubs.filter((s) => s.id !== sub.id)]
              : allSubs;
            const displaySub =
              isHovered && hasMultiple
                ? reorderedSubs[currentTooltipIndex]
                : sub;
            tooltipStyle.borderColor = displaySub?.color;

            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (
              <div
                key={day}
                data-date={day}
                className={`bg-gray-900 rounded-2xl flex flex-col items-center justify-between relative transition-all duration-200 hover:bg-gray-800 hover:scale-105 p-3 h-24 ${
                  isToday ? "ring-2 ring-blue-500" : ""
                } ${isHovered ? "z-30" : ""}`}
                onMouseEnter={() => {
                  if (allSubs.length > 0) {
                    setHoveredDate(day);
                    setCurrentTooltipIndex(0);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredDate(null);
                  setCurrentTooltipIndex(0);
                }}
              >
                {sub && (
                  <div className="absolute top-2 right-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: sub.color }}
                    />
                  </div>
                )}
                {sub && hasMultiple && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPrimarySelector(day);
                      setSelectorAnimating(true);
                      setTimeout(() => setSelectorAnimating(false), 600);
                    }}
                    className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-700 transition-colors"
                    style={{ fontSize: "10px" }}
                  >
                    +{allSubs.length - 1}
                  </button>
                )}
                {sub && (
                  <div
                    className="flex-1 flex items-center justify-center text-3xl"
                    style={{ opacity: showCircle || animatingIcons ? 0 : 1 }}
                  >
                    {renderSubscriptionIcon(sub)}
                  </div>
                )}
                {!sub && <div className="flex-1"></div>}
                <div className="text-2xl font-light">
                  {day.toString().padStart(2, "0")}
                </div>
                {isHovered && displaySub && (
                  <div
                    className={tooltipClass}
                    style={{
                      ...tooltipStyle,
                      animation: isCentered
                        ? "popupCentered 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                        : "popup 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    }}
                  >
                    {hasMultiple && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isTooltipTransitioning) return;
                            setIsTooltipTransitioning(true);
                            setTooltipSlideDirection("right");
                            setTimeout(() => {
                              setCurrentTooltipIndex(
                                (currentTooltipIndex -
                                  1 +
                                  reorderedSubs.length) %
                                  reorderedSubs.length
                              );
                              setTooltipSlideDirection("");
                              setIsTooltipTransitioning(false);
                            }, 200);
                          }}
                          className="absolute top-2 left-2 text-white hover:text-gray-300 transition-colors"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isTooltipTransitioning) return;
                            setIsTooltipTransitioning(true);
                            setTooltipSlideDirection("left");
                            setTimeout(() => {
                              setCurrentTooltipIndex(
                                (currentTooltipIndex + 1) % reorderedSubs.length
                              );
                              setTooltipSlideDirection("");
                              setIsTooltipTransitioning(false);
                            }, 200);
                          }}
                          className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </>
                    )}
                    <div
                      className="flex items-center justify-between mb-3"
                      style={{
                        paddingTop: hasMultiple ? "20px" : "0",
                        animation:
                          tooltipSlideDirection === "left"
                            ? "tooltipSlideOutLeft 0.2s ease-out"
                            : tooltipSlideDirection === "right"
                            ? "tooltipSlideOutRight 0.2s ease-out"
                            : tooltipSlideDirection === "" &&
                              isTooltipTransitioning
                            ? "none"
                            : "tooltipSlideIn 0.2s ease-out",
                        opacity: tooltipSlideDirection ? 0 : 1,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {renderSubscriptionIcon(displaySub)}
                        </div>
                        <span className="font-semibold text-xl text-white whitespace-nowrap">
                          {displaySub.name}
                        </span>
                      </div>
                      <span className="font-bold text-xl text-white text-right ml-12">
                        {displaySub.currency || "€"}{displaySub.amount.toFixed(2)}
                      </span>
                    </div>
                    <div
                      className="flex justify-between mb-3"
                      style={{
                        animation:
                          tooltipSlideDirection === "left"
                            ? "tooltipSlideOutLeft 0.2s ease-out"
                            : tooltipSlideDirection === "right"
                            ? "tooltipSlideOutRight 0.2s ease-out"
                            : tooltipSlideDirection === "" &&
                              isTooltipTransitioning
                            ? "none"
                            : "tooltipSlideIn 0.2s ease-out",
                        opacity: tooltipSlideDirection ? 0 : 1,
                      }}
                    >
                      <div className="text-white font-bold whitespace-nowrap">
                        {displaySub.frequency}
                      </div>
                      <div className="text-gray-400 text-right ml-12 whitespace-nowrap">
                        Next payment
                      </div>
                    </div>
                    <div
                      className="flex justify-between"
                      style={{
                        animation:
                          tooltipSlideDirection === "left"
                            ? "tooltipSlideOutLeft 0.2s ease-out"
                            : tooltipSlideDirection === "right"
                            ? "tooltipSlideOutRight 0.2s ease-out"
                            : tooltipSlideDirection === "" &&
                              isTooltipTransitioning
                            ? "none"
                            : "tooltipSlideIn 0.2s ease-out",
                        opacity: tooltipSlideDirection ? 0 : 1,
                      }}
                    >
                      <span className="text-white font-bold whitespace-nowrap">
                        Total since {displaySub.since.split("-")[1]}-
                        {displaySub.since.split("-")[0]}
                      </span>
                      <span className="font-bold text-xl text-white text-right ml-12">
                        {displaySub.currency || "€"}{displaySub.total.toFixed(2)}
                      </span>
                    </div>
                    {displaySub.url && (
                      <div
                        className="mt-3 pt-3 border-t border-gray-700 flex justify-center"
                        style={{
                          animation:
                            tooltipSlideDirection === "left"
                              ? "tooltipSlideOutLeft 0.2s ease-out"
                              : tooltipSlideDirection === "right"
                              ? "tooltipSlideOutRight 0.2s ease-out"
                              : tooltipSlideDirection === "" &&
                                isTooltipTransitioning
                              ? "none"
                              : "tooltipSlideIn 0.2s ease-out",
                          opacity: tooltipSlideDirection ? 0 : 1,
                        }}
                      >
                        <a
                          href={normalizeUrl(displaySub.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80 pointer-events-auto"
                          style={{ color: displaySub.color, cursor: "pointer" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          Visit website →
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showPrimarySelector && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            onClick={() => {
              setSelectorClosing(true);
              setTimeout(() => {
                setShowPrimarySelector(null);
                setSelectorClosing(false);
                setSelectorAnimating(false);
              }, 800);
            }}
            style={{ animation: "fadeIn 0.2s ease-out" }}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const subs = getSubscriptionsForDate(showPrimarySelector);
                const currentPrimary =
                  getSubscriptionForDate(showPrimarySelector);
                const radius = 120;
                const centerSize = 100;

                const calendarElement = document.querySelector(
                  `[data-date="${showPrimarySelector}"]`
                );
                let calendarRect = {
                  left: window.innerWidth / 2,
                  top: window.innerHeight / 2,
                  width: 0,
                  height: 0,
                };

                if (calendarElement) {
                  calendarRect = calendarElement.getBoundingClientRect();
                }

                const calendarCenterX =
                  calendarRect.left +
                  calendarRect.width / 2 -
                  window.innerWidth / 2;
                const calendarCenterY =
                  calendarRect.top +
                  calendarRect.height / 2 -
                  window.innerHeight / 2;

                return (
                  <>
                    <div
                      className="absolute bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-gray-600"
                      style={{
                        width: `${centerSize}px`,
                        height: `${centerSize}px`,
                        left: "50%",
                        top: "50%",
                        transform: selectorAnimating
                          ? `translate(calc(-50% + ${calendarCenterX}px), calc(-50% + ${calendarCenterY}px)) scale(0.5)`
                          : selectorClosing
                          ? `translate(calc(-50% + ${calendarCenterX}px), calc(-50% + ${calendarCenterY}px)) scale(0.3)`
                          : "translate(-50%, -50%) scale(1)",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        transitionDelay: selectorClosing ? "0.4s" : "0s",
                        opacity: selectorClosing ? 0 : 1,
                      }}
                    >
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Day</div>
                        <div className="text-3xl font-bold">
                          {showPrimarySelector}
                        </div>
                      </div>
                    </div>
                    {subs.map((sub, index) => {
                      const angle =
                        ((index * 360) / subs.length - 90) * (Math.PI / 180);
                      const x = radius * Math.cos(angle);
                      const y = radius * Math.sin(angle);
                      const isPrimary = sub.id === currentPrimary.id;

                      return (
                        <button
                          key={sub.id}
                          onClick={async () => {
                            // Update state and save immediately
                            const updatedPrimary = {
                              ...primarySubsByDay,
                              [showPrimarySelector]: sub.id,
                            };
                            setPrimarySubsByDay(updatedPrimary);

                            // Save immediately - don't wait for useEffect
                            try {
                              await window.storage.set(
                                "primarySubsByDay",
                                JSON.stringify(updatedPrimary)
                              );
                            } catch (error) {
                              console.error(
                                "Failed to save primary selection:",
                                error
                              );
                            }

                            setNewPrimaryId(sub.id);
                            // --- NEW: Track exactly what we changed ---
                            setJustSelected({
                              id: sub.id,
                              day: showPrimarySelector,
                            });
                            // -----------------------------------------

                            setTimeout(() => {
                              setSelectorClosing(true);
                              setTimeout(() => {
                                setShowPrimarySelector(null);
                                setHoveredDate(null);
                                setCurrentTooltipIndex(0);
                                setSelectorClosing(false);
                                setSelectorAnimating(false);
                                setNewPrimaryId(null);
                              }, 800);
                            }, 200);
                          }}
                          className="absolute w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110 border-4"
                          style={{
                            left: "50%",
                            top: "50%",
                            transform: selectorAnimating
                              ? "translate(-50%, -50%) scale(0)"
                              : selectorClosing
                              ? "translate(-50%, -50%) scale(0)"
                              : `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`,
                            transition: `all 0.4s cubic-bezier(0.4, 0, 0.2, 1)`,
                            transitionDelay: selectorAnimating
                              ? `${1.0 + index * 0.05}s`
                              : selectorClosing
                              ? `${0.2 + index * 0.05}s`
                              : "0s",
                            backgroundColor:
                              newPrimaryId === sub.id
                                ? "#10b981"
                                : newPrimaryId && isPrimary
                                ? "#374151"
                                : isPrimary
                                ? "#10b981"
                                : "#374151",
                            borderColor:
                              newPrimaryId === sub.id
                                ? "#059669"
                                : newPrimaryId && isPrimary
                                ? "#4b5563"
                                : isPrimary
                                ? "#059669"
                                : "#4b5563",
                            opacity: selectorAnimating
                              ? 0
                              : selectorClosing
                              ? 0
                              : 1,
                          }}
                        >
                          {renderSubscriptionIcon(sub)}
                        </button>
                      );
                    })}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {animatingIcons && (
          <div className="fixed inset-0 z-40 pointer-events-none">
            {subscriptions.map((sub, index) => {
              const previousAngles = subscriptions
                .slice(0, index)
                .reduce((sum, s) => sum + getProportionalAngle(s.amount), 0);
              const segmentAngle = getProportionalAngle(sub.amount);
              const angleOffset = -90 + previousAngles;
              const midAngle =
                (angleOffset + segmentAngle / 2) * (Math.PI / 180);
              const iconRadius = 220;
              const circleX =
                window.innerWidth / 2 + iconRadius * Math.cos(midAngle);
              const circleY =
                window.innerHeight / 2 + iconRadius * Math.sin(midAngle);

              const calendarElement = document.querySelector(
                `[data-date="${sub.day}"]`
              );
              let calendarX = circleX;
              let calendarY = circleY;

              if (calendarElement) {
                const rect = calendarElement.getBoundingClientRect();
                calendarX = rect.left + rect.width / 2;
                calendarY = rect.top + rect.height / 2 - 15;
              }

              // Check if THIS subscription is the primary one shown on the calendar
              const isPrimaryForDay = justSelectedPrimaryId
                ? sub.id === justSelectedPrimaryId
                : getSubscriptionForDate(sub.day)?.id === sub.id;
              const shouldFadeOut = circleClosing && !isPrimaryForDay;

              console.log(
                `[${circleClosing ? "CLOSING" : "OPENING"}] Sub ${
                  sub.name
                } (id: ${
                  sub.id
                }): justSelectedPrimaryId=${justSelectedPrimaryId}, isPrimaryForDay=${isPrimaryForDay}, shouldFadeOut=${shouldFadeOut}`
              );

              const isClosing = circleClosing;
              const startX = isClosing ? circleX : calendarX;
              const startY = isClosing ? circleY : calendarY;
              const endX = isClosing ? calendarX : circleX;
              const endY = isClosing ? calendarY : circleY;

              return (
                <div
                  key={sub.id}
                  className="absolute text-3xl"
                  style={{
                    left: `${startX}px`,
                    top: `${startY}px`,
                    transform: "translate(-50%, -50%)",
                    animation: shouldFadeOut
                      ? "fadeOut 0.4s ease-out forwards"
                      : `moveIcon-${sub.id} 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                  }}
                >
                  {renderSubscriptionIcon(sub)}
                  {!shouldFadeOut && (
                    <style>{`
                @keyframes moveIcon-${sub.id} {
                  0% {
                    left: ${startX}px;
                    top: ${startY}px;
                  }
                  100% {
                    left: ${endX}px;
                    top: ${endY}px;
                  }
                }
              `}</style>
                  )}
                </div>
              );
            })}

            {animatingTotal &&
              (() => {
                const totalButtonElement = document.querySelector(
                  'button[class*="text-right"]'
                );
                let calendarX = window.innerWidth - 150;
                let calendarY = 100;

                if (totalButtonElement) {
                  const rect = totalButtonElement.getBoundingClientRect();
                  calendarX = rect.left + rect.width / 2;
                  calendarY = rect.top + rect.height / 2;
                }

                const circleX = window.innerWidth / 2;
                const circleY = window.innerHeight / 2;

                const isClosing = circleClosing;
                const startX = isClosing ? circleX : calendarX;
                const startY = isClosing ? circleY : calendarY;
                const endX = isClosing ? calendarX : circleX;
                const endY = isClosing ? calendarY : circleY;

                return (
                  <div
                    className="absolute text-center"
                    style={{
                      left: `${startX}px`,
                      top: `${startY}px`,
                      transform: "translate(-50%, -50%)",
                      animation: `moveTotalSpend 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                      width: "200px",
                    }}
                  >
                    <div className="text-sm text-gray-400">Monthly spend</div>
                    <div className="text-3xl font-bold">{primaryCurrency}{totalSpend}</div>
                    <style>{`
                @keyframes moveTotalSpend {
                  0% {
                    left: ${startX}px;
                    top: ${startY}px;
                  }
                  100% {
                    left: ${endX}px;
                    top: ${endY}px;
                  }
                }
              `}</style>
                  </div>
                );
              })()}
          </div>
        )}

        {showCircle && (
          <div
            className="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-90"
            style={{
              opacity: circleClosing ? (animatingIcons ? 0 : 1) : 1,
              animation: circleOpening ? "fade-in 0.8s ease-out" : "none",
              transition:
                circleClosing && animatingIcons
                  ? "opacity 0.4s ease-out"
                  : "none",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !circleClosing)
                handleCloseCircle();
            }}
          >
            <div className="relative w-[500px] h-[500px]">
              <svg
                width="500"
                height="500"
                viewBox="0 0 500 500"
                style={{
                  opacity: circleClosing && animatingIcons ? 0 : 1,
                  transition:
                    circleClosing && animatingIcons
                      ? "opacity 0.4s ease-out"
                      : "none",
                }}
              >
                <defs>
                  {subscriptions.map((sub) => (
                    <linearGradient
                      key={`grad-${sub.id}`}
                      id={`gradient-${sub.id}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: sub.color, stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: sub.color, stopOpacity: 0.8 }}
                      />
                    </linearGradient>
                  ))}
                </defs>

                {subscriptions.map((sub, index) => {
                  const previousAngles = subscriptions
                    .slice(0, index)
                    .reduce(
                      (sum, s) => sum + getProportionalAngle(s.amount),
                      0
                    );
                  const segmentAngle = getProportionalAngle(sub.amount);
                  const gapSize = subscriptions.length === 1 ? 0 : 16;
                  const angleOffset = -90 + previousAngles;
                  const midAngle =
                    (angleOffset + segmentAngle / 2) * (Math.PI / 180);

                  const radius = 170;
                  const strokeWidth = 35;
                  const centerX = 250;
                  const centerY = 250;

                  const iconRadius = 220;
                  const iconX = centerX + iconRadius * Math.cos(midAngle);
                  const iconY = centerY + iconRadius * Math.sin(midAngle);

                  // For the static (open) view, handle full-circle case
                  const effectiveGap = segmentAngle > gapSize ? gapSize : Math.max(segmentAngle * 0.2, 2);
                  const arcSize = Math.max(segmentAngle - effectiveGap, 0.1);

                  // Build the path — split into two arcs for near-full-circle
                  let pathData: string;
                  if (arcSize >= 359) {
                    const half = arcSize / 2;
                    const startDeg = angleOffset + effectiveGap / 2;
                    const midDeg = startDeg + half;
                    const endDeg = startDeg + arcSize;

                    const s1 = startDeg * (Math.PI / 180);
                    const m1 = midDeg * (Math.PI / 180);
                    const e1 = endDeg * (Math.PI / 180);

                    const ax1 = centerX + radius * Math.cos(s1);
                    const ay1 = centerY + radius * Math.sin(s1);
                    const ax2 = centerX + radius * Math.cos(m1);
                    const ay2 = centerY + radius * Math.sin(m1);
                    const ax3 = centerX + radius * Math.cos(e1);
                    const ay3 = centerY + radius * Math.sin(e1);

                    const la1 = half > 180 ? 1 : 0;
                    const la2 = half > 180 ? 1 : 0;

                    pathData = `M ${ax1} ${ay1} A ${radius} ${radius} 0 ${la1} 1 ${ax2} ${ay2} A ${radius} ${radius} 0 ${la2} 1 ${ax3} ${ay3}`;
                  } else {
                    const startAngle = (angleOffset + effectiveGap / 2) * (Math.PI / 180);
                    const endAngle = (angleOffset + segmentAngle - effectiveGap / 2) * (Math.PI / 180);
                    const x1 = centerX + radius * Math.cos(startAngle);
                    const y1 = centerY + radius * Math.sin(startAngle);
                    const x2 = centerX + radius * Math.cos(endAngle);
                    const y2 = centerY + radius * Math.sin(endAngle);
                    const largeArc = arcSize > 180 ? 1 : 0;
                    pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
                  }

                  // Calculate arc length for stroke-dash animation
                  const arcLength = (arcSize / 360) * 2 * Math.PI * radius;
                  const isAnimating = circleOpeningDash || circleClosing;
                  const dashOffset = isAnimating ? arcLength : 0;

                  return (
                    <g key={sub.id}>
                      <path
                        d={pathData}
                        fill="none"
                        stroke={`url(#gradient-${sub.id})`}
                        strokeWidth={
                          selectedSub?.id === sub.id ? strokeWidth + 3 : strokeWidth
                        }
                        strokeLinecap="round"
                        strokeDasharray={arcLength}
                        strokeDashoffset={dashOffset}
                        style={{
                          opacity: selectedSub?.id === sub.id ? 1 : 0.85,
                          transition: isAnimating
                            ? "stroke-dashoffset 0.8s ease-out, opacity 0.3s ease"
                            : "all 0.3s ease",
                        }}
                        onMouseEnter={() => {
                          if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
                          setFadingOut(false);
                          setSelectedSub(sub);
                        }}
                        onMouseLeave={() => {
                          setFadingOut(true);
                          fadeTimeoutRef.current = setTimeout(() => {
                            setSelectedSub(null);
                            setFadingOut(false);
                          }, 500);
                        }}
                      />
                      {!animatingIcons && (
                        <>
                          <circle
                            cx={iconX} cy={iconY} r="22"
                            fill={sub.name === "Amazon" || sub.name === "Jet Brains" ? "#3a3a3a" : "transparent"}
                            style={{
                              transform: selectedSub?.id === sub.id ? "scale(1.15)" : "scale(1)",
                              transformOrigin: `${iconX}px ${iconY}px`,
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={() => {
                              if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
                              setFadingOut(false);
                              setSelectedSub(sub);
                            }}
                            onMouseLeave={() => {
                              setFadingOut(true);
                              fadeTimeoutRef.current = setTimeout(() => {
                                setSelectedSub(null);
                                setFadingOut(false);
                              }, 500);
                            }}
                          />
                          {sub.icon && sub.icon.startsWith("favicon:") && (
                            <image
                              href={`https://www.google.com/s2/favicons?domain=${sub.icon.replace("favicon:", "")}&sz=64`}
                              x={iconX - 14}
                              y={iconY - 14}
                              width="28"
                              height="28"
                              className="pointer-events-none"
                            />
                          )}
                          {!(sub.icon && sub.icon.startsWith("favicon:")) && (() => {
                            if (sub.icon === "N") return <text x={iconX} y={iconY} textAnchor="middle" dominantBaseline="middle" fill="#E50914" fontSize="28" fontWeight="bold" className="pointer-events-none">N</text>;
                            if (sub.icon === "in") return <text x={iconX} y={iconY} textAnchor="middle" dominantBaseline="middle" fill="#0A66C2" fontSize="20" fontWeight="bold" className="pointer-events-none">in</text>;
                            if (sub.icon === "a") return <text x={iconX} y={iconY} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="28" fontWeight="bold" className="pointer-events-none">a</text>;
                            if (sub.icon === "M") return <text x={iconX} y={iconY} textAnchor="middle" dominantBaseline="middle" fill="#FF3D57" fontSize="28" fontWeight="bold" className="pointer-events-none">M</text>;
                            if (["♫", "⚡", "🔧", "🌀"].includes(sub.icon)) return <text x={iconX} y={iconY} textAnchor="middle" dominantBaseline="middle" fontSize="24" className="pointer-events-none">{sub.icon}</text>;
                            const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1F004}-\u{1F0CF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}\u{1F170}-\u{1F251}]/u;
                            if (emojiRegex.test(sub.icon)) return <text x={iconX} y={iconY} textAnchor="middle" dominantBaseline="middle" fontSize="24" className="pointer-events-none">{sub.icon}</text>;
                            return <text x={iconX} y={iconY} textAnchor="middle" dominantBaseline="middle" fill={sub.color} fontSize="28" fontWeight="bold" className="pointer-events-none">{sub.icon}</text>;
                          })()}
                        </>
                      )}
                    </g>
                  );

                })}
              </svg>

              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[250px] h-[140px] flex items-center justify-center pointer-events-none"
                style={{
                  opacity: animatingIcons ? 0 : 1,
                  transition: "opacity 0.5s ease-out",
                }}
              >
                {selectedSub ? (
                  <div
                    key={selectedSub.id}
                    className="bg-gray-900 rounded-xl p-5 border-2 shadow-2xl text-center w-full pointer-events-none"
                    style={{
                      borderColor: selectedSub.color,
                      animation: fadingOut
                        ? "fade-out 0.5s ease-out forwards"
                        : "fade-in 0.5s ease-out",
                    }}
                  >
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="text-2xl">
                        {renderSubscriptionIcon(selectedSub)}
                      </div>
                      <span className="font-semibold text-lg">
                        {selectedSub.name}
                      </span>
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {selectedSub.currency || "€"}{selectedSub.amount.toFixed(2)} / {selectedSub.frequency}
                    </div>
                    <div className="text-xs text-gray-400">
                      Total since {selectedSub.since.split("-")[1]}-
                      {selectedSub.since.split("-")[0]}:{" "}
                      <span className="font-semibold">
                        {selectedSub.currency || "€"}{selectedSub.total.toFixed(2)}
                      </span>
                    </div>
                    {selectedSub.url && (
                      <a
                        href={normalizeUrl(selectedSub.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold mt-2 transition-colors hover:opacity-80 pointer-events-auto"
                        style={{ color: selectedSub.color, cursor: "pointer" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Visit →
                      </a>
                    )}
                  </div>
                ) : (
                  <div
                    className="text-center hover:opacity-80 transition-opacity pointer-events-auto"
                    style={{ opacity: animatingIcons ? 0 : 1, transition: "opacity 0.5s ease-out" }}
                    onClick={handleCloseCircle}
                  >
                    <div className="text-sm text-gray-400">Monthly spend</div>
                    <div className="text-4xl font-bold">{primaryCurrency}{totalSpend}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Click to close
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
