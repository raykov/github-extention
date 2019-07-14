function timeAgo(time) {
  const date = new Date(time).getTime();
  const now = new Date().getTime();
  const diff = now - date;

  const period = findPeriod(0, diff);

  return `${period.count} ${period.entity} ago`
}

STEPS = {
  "-1": {
    singular: "millisecond",
    plural: "milliseconds"
  },
  0: {
    singular: "second",
    plural: "seconds"
  },
  1: {
    singular: "minute",
    plural: "minutes"
  },
  2: {
    singular: "hour",
    plural: "hours"
  },
  3: {
    singular: "day",
    plural: "days"
  },
  4: {
    singular: "week",
    plural: "weeks"
  },
  5: {
    singular: "month",
    plural: "months"
  },
  6: {
    singular: "year",
    plural: "years"
  },
  7: {
    singular: "decade",
    plural: "decades"
  },
  8: {
    singular: "century",
    plural: "centuries"
  },
};
DIVIDERS = [1000, 60, 60, 24, 7, 365 / 7 / 12, 12, 10, 10];

function findPeriod(step, diff) {
  const newDiff = diff / DIVIDERS[step];

  if (newDiff > 1) {
    return findPeriod(step + 1, newDiff)
  }

  const roundedDiff = Math.floor(diff);

  return {
    count: roundedDiff,
    entity: STEPS[step - 1][roundedDiff === 1 ? "singular" : "plural"]
  }
}
