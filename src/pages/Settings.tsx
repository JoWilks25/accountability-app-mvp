import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getWeekDateRange } from '../utils/dateUtils';

const Settings: React.FC = () => {
  const { currentUser, currentPod, updatePodSettings } = useApp();
  const [weekStartDay, setWeekStartDay] = useState<number>(0);

  // Initialize weekStartDay with the current pod's setting
  useEffect(() => {
    if (currentPod) {
      setWeekStartDay(currentPod.settings.weekStartDay);
    }
  }, [currentPod]);

  const weekDays = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const handleSaveSettings = () => {
    if (currentPod) {
      updatePodSettings(currentPod.id, {
        ...currentPod.settings,
        weekStartDay,
      });
    }
  };

  if (!currentUser || !currentPod) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pod Settings</h2>
        <p className="text-gray-600">Please select or create a pod to manage settings.</p>
      </div>
    );
  }

  const isPodCaptain = currentPod.ownerId === currentUser.id;

  // Example week preview
  const weekPreview = getWeekDateRange(1, weekStartDay);

  return (
    <div className="pb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pod Settings</h1>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Week Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {isPodCaptain ? (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Week Start Day
                  </label>
                  <select
                    value={weekStartDay}
                    onChange={(e) => setWeekStartDay(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    {weekDays.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-gray-500">
                    Choose which day of the week your pod's week starts on.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                  <p className="text-sm text-gray-600">
                    With this setting, your first week will be:
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {weekPreview}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    Save Settings
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Only the pod captain can modify these settings. The week currently starts on{' '}
                  <span className="font-medium">
                    {weekDays.find(d => d.value === currentPod.settings.weekStartDay)?.label}
                  </span>.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Current week format:
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {weekPreview}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;