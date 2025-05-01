export const stepItems = [
          {
          title: 'Lead Generation',
        },
        {
          title: 'In Documents',
        },
        // {
        //   title: 'In Preparation',
        // },
        {
          title: 'In Preparation ',
        },
        {
          title: 'In Payments',
        },
        {
          title: 'In Filling',
        },
        {
          title: 'Completed',
        },
      ]

export const getLeadStatusIndex = (id: string) => {
  switch(id) {
      case '5':
          return 0;  // corresponds to "Lead Generation"
      case '1':
          return 1;  // corresponds to "In Process"
      case '2':
          return 2;  // corresponds to "In Review"
      case '3':
          return 3;  // corresponds to "In Payments"
      case '4':
          return 4;  // corresponds to "In Submission" (assuming you missed this in your original function)
      case '6':
          return 5;  // corresponds to "Completed"
      case '7':
            return 6;  // corresponds to "Completed"
      default:
        return -1;  // Not found
    }
}