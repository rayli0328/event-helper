// Simple Excel export utility
export const exportToExcel = (data: any[], filename: string = 'participant-report') => {
  // Create CSV content
  const csvContent = convertToCSV(data);
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';
  
  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Escape commas and quotes in values
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
};

export const exportParticipantReport = (reportData: any) => {
  const { participants, summary } = reportData;
  
  // Create summary data
  const summaryData = [
    { Metric: 'Total Participants', Value: summary.totalParticipants },
    { Metric: 'Total Games', Value: summary.totalGames },
    { Metric: 'Participants with Gifts', Value: summary.participantsWithGifts },
    { Metric: 'Average Completion %', Value: `${summary.averageCompletion}%` },
  ];
  
  // Create participant data with formatted dates and game details
  const participantData = participants.map((p: any) => {
    const baseData = {
      'Staff ID': p.staffId,
      'Last Name': p.lastName,
      'Registration Date': p.createdAt.toLocaleDateString(),
      'Completed Games': p.completedGames,
      'Total Games': p.totalGames,
      'Completion %': `${p.completionPercentage}%`,
      'Gift Redeemed': p.giftRedeemed ? 'Yes' : 'No',
      'Gift Redeemed Date': p.giftRedeemedAt ? p.giftRedeemedAt.toLocaleDateString() : 'N/A',
    };

    // Add individual game status columns
    const gameColumns: any = {};
    if (p.gameStatus && p.gameStatus.length > 0) {
      p.gameStatus.forEach((game: any, index: number) => {
        gameColumns[`Game ${index + 1}: ${game.gameName}`] = game.isCompleted ? 'Completed' : 'Not Completed';
      });
    }

    return { ...baseData, ...gameColumns };
  });
  
  // Export summary first
  exportToExcel(summaryData, 'event-summary');
  
  // Export participants
  exportToExcel(participantData, 'participant-details');
};
