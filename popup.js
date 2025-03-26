document.addEventListener('DOMContentLoaded', function() {
    // Load data from storage
    loadData();
    
    // Add event listeners
    document.getElementById('addEntryBtn').addEventListener('click', addEntry);
    document.getElementById('addMultipleBtn').addEventListener('click', addMultipleEntries);
    document.getElementById('clearBtn').addEventListener('click', clearData);
    
    // Tab event listeners
    document.getElementById('tabAddSingle').addEventListener('click', function(event) {
      openTab(event, 'addSingle');
    });
    document.getElementById('tabAddMultiple').addEventListener('click', function(event) {
      openTab(event, 'addMultiple');
    });
    document.getElementById('tabViewEntries').addEventListener('click', function(event) {
      openTab(event, 'viewEntries');
    });
  });
  
  // TimeTracker class to handle working hours calculation
  class TimeTracker {
    constructor(days = 0, averageHours = 0, averageMinutes = 0) {
      this.workEntries = [];
      // Store entries with dates
      this.workEntriesWithDates = [];
      this.initializeWithAverage(days, averageHours, averageMinutes);
    }
    
    initializeWithAverage(days, hours, minutes) {
      if (days <= 0) return;
      
      const avgMinutes = hours * 60 + minutes;
      
      // Store the total minutes as if we had individual entries
      const today = new Date();
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        this.workEntries.push(avgMinutes);
        this.workEntriesWithDates.push({
          date: date.toISOString().split('T')[0],
          minutes: avgMinutes
        });
      }
    }
    
    addEntry(hours, minutes = 0) {
      const totalMinutes = hours * 60 + minutes;
      this.workEntries.push(totalMinutes);
      
      // Add with date
      const today = new Date();
      this.workEntriesWithDates.push({
        date: today.toISOString().split('T')[0],
        minutes: totalMinutes
      });
      
      const avg = this.calculateAverage();
      return `${avg.hours}:${avg.minutes.toString().padStart(2, '0')}`;
    }
    
    addMultipleEntries(days, hours, minutes = 0) {
      const totalMinutes = hours * 60 + minutes;
      const today = new Date();
      
      for (let i = 0; i < days; i++) {
        this.workEntries.push(totalMinutes);
        
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        this.workEntriesWithDates.push({
          date: date.toISOString().split('T')[0],
          minutes: totalMinutes
        });
      }
      
      const avg = this.calculateAverage();
      return `${avg.hours}:${avg.minutes.toString().padStart(2, '0')}`;
    }
    
    deleteEntry(index) {
      if (index >= 0 && index < this.workEntriesWithDates.length) {
        this.workEntries.splice(index, 1);
        this.workEntriesWithDates.splice(index, 1);
        return true;
      }
      return false;
    }
    
    calculateAverage() {
      if (this.workEntries.length === 0) return { hours: 0, minutes: 0 };
      
      const avgMinutes = Math.floor(this.workEntries.reduce((a, b) => a + b, 0) / this.workEntries.length);
      const hours = Math.floor(avgMinutes / 60);
      const minutes = avgMinutes % 60;
      
      return { hours, minutes };
    }
    
    getEntryCount() {
      return this.workEntries.length;
    }
    
    getData() {
      const avg = this.calculateAverage();
      return {
        days: this.workEntries.length,
        averageHours: avg.hours,
        averageMinutes: avg.minutes,
        entries: this.workEntries,
        entriesWithDates: this.workEntriesWithDates
      };
    }
  }
  
  let tracker = new TimeTracker();
  
  function loadData() {
    chrome.storage.local.get(['timeTrackerData'], function(result) {
      if (result.timeTrackerData) {
        const data = result.timeTrackerData;
        tracker = new TimeTracker();
        
        // Restore all individual entries with dates
        if (data.entriesWithDates && Array.isArray(data.entriesWithDates)) {
          tracker.workEntriesWithDates = [...data.entriesWithDates];
          tracker.workEntries = tracker.workEntriesWithDates.map(entry => entry.minutes);
        } else if (data.entries && Array.isArray(data.entries)) {
          // Fallback to entries without dates
          tracker.workEntries = [...data.entries];
          
          // Create entries with dates (using today's date as reference)
          const today = new Date();
          tracker.workEntriesWithDates = tracker.workEntries.map((minutes, index) => {
            const date = new Date(today);
            date.setDate(date.getDate() - index);
            return {
              date: date.toISOString().split('T')[0],
              minutes: minutes
            };
          });
        } else {
          // Last fallback to old method
          tracker = new TimeTracker(data.days, data.averageHours, data.averageMinutes);
        }
        
        updateUI();
      }
    });
  }
  
  function saveData() {
    const data = tracker.getData();
    chrome.storage.local.set({ timeTrackerData: data });
  }
  
  function updateUI() {
    const count = tracker.getEntryCount();
    const avg = tracker.calculateAverage();
    
    document.getElementById('daysCount').textContent = count;
    document.getElementById('averageTime').textContent = 
      `${avg.hours}:${avg.minutes.toString().padStart(2, '0')}`;
      
    // Update entries list
    updateEntriesList();
  }
  
  function updateEntriesList() {
    const entriesList = document.getElementById('entriesList');
    entriesList.innerHTML = '';
    
    if (tracker.workEntriesWithDates.length === 0) {
      entriesList.innerHTML = '<div class="entry-item">No entries yet</div>';
      return;
    }
    
    // Sort entries by date (newest first)
    const sortedEntries = [...tracker.workEntriesWithDates].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    sortedEntries.forEach((entry, index) => {
      const minutes = entry.minutes;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      const entryItem = document.createElement('div');
      entryItem.className = 'entry-item';
      
      const formattedDate = formatDate(entry.date);
      const formattedTime = `${hours}:${mins.toString().padStart(2, '0')}`;
      
      const spanElement = document.createElement('span');
      spanElement.textContent = `${formattedDate}: ${formattedTime}`;
      
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-btn';
      deleteButton.textContent = 'Delete';
      deleteButton.dataset.index = tracker.workEntriesWithDates.indexOf(entry);
      deleteButton.addEventListener('click', function() {
        const index = parseInt(this.dataset.index);
        deleteEntry(index);
      });
      
      entryItem.appendChild(spanElement);
      entryItem.appendChild(deleteButton);
      entriesList.appendChild(entryItem);
    });
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }
  
  function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, duration);
  }
  
  function addEntry() {
    const hours = parseInt(document.getElementById('hoursInput').value) || 0;
    const minutes = parseInt(document.getElementById('minutesInput').value) || 0;
    
    if (hours === 0 && minutes === 0) {
      showNotification('Please enter valid working hours!', 2000);
      return;
    }
    
    tracker.addEntry(hours, minutes);
    saveData();
    updateUI();
    
    // Show success notification
    const avg = tracker.calculateAverage();
    showNotification(`Entry added: ${hours}h ${minutes}m\nNew average: ${avg.hours}h ${avg.minutes}m`);
  }
  
  function addMultipleEntries() {
    const days = parseInt(document.getElementById('daysInput').value) || 0;
    const hours = parseInt(document.getElementById('multiHoursInput').value) || 0;
    const minutes = parseInt(document.getElementById('multiMinutesInput').value) || 0;
    
    if (days <= 0) {
      showNotification('Please enter a valid number of days!', 2000);
      return;
    }
    
    if (hours === 0 && minutes === 0) {
      showNotification('Please enter valid working hours!', 2000);
      return;
    }
    
    tracker.addMultipleEntries(days, hours, minutes);
    saveData();
    updateUI();
    
    // Show success notification
    const avg = tracker.calculateAverage();
    showNotification(`Added ${days} entries of ${hours}h ${minutes}m each\nNew average: ${avg.hours}h ${avg.minutes}m`);
  }
  
  function deleteEntry(index) {
    if (tracker.deleteEntry(index)) {
      saveData();
      updateUI();
      showNotification('Entry deleted successfully');
    } else {
      showNotification('Error deleting entry', 2000);
    }
  }
  
  function clearData() {
    tracker = new TimeTracker();
    saveData();
    updateUI();
    showNotification('All data has been cleared');
  }
  
  // Tab functionality
  function openTab(evt, tabName) {
    // Declare all variables
    let i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }