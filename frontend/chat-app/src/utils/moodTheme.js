export const getMoodTheme = (mood) => {

  switch (mood) {

    // 😊 HAPPY
    case "happy":
      return {
        bg: `
          from-yellow-50
          via-orange-50
          to-amber-50
        `,
        bubble: `
          bg-yellow-100
          text-gray-700
          border border-yellow-200
        `,
      };

    // 😢 SAD
    case "sad":
      return {
        bg: `
          from-[#EEF5FF]
          via-[#E6F0FF]
          to-[#DDEBFF]
        `,
        bubble: `
          bg-[#D9E8FF]
          text-[#556070]
          border border-[#C6DBFF]
        `,
      };

    // 😡 ANGRY
    case "angry":
      return {
        bg: `
          from-rose-50
          via-red-50
          to-pink-50
        `,
        bubble: `
          bg-rose-100
          text-gray-700
          border border-rose-200
        `,
      };

    // 💜 ROMANTIC
    case "romantic":
      return {
        bg: `
          from-pink-50
          via-rose-50
          to-fuchsia-50
        `,
        bubble: `
          bg-pink-100
          text-gray-700
          border border-pink-200
        `,
      };

    // 😐 NEUTRAL
    default:
      return {
        bg: `
          from-[#F3EEFF]
          via-[#EEE8FF]
          to-[#E6F0F7]
        `,
        bubble: `
          bg-[#E8E1F8]
          text-[#5E5A72]
          border border-[#D8D1EC]
        `,
      };
  }

};