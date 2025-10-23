// import store from '@/store'

// const findMenu = (list, title) => {
//   let find = null
//   for(let i = 0; i < list.length; i++) {
//     const item = list[i]
//     if (item.title === title) {
//       find = item
//       break
//     } else {
//       if (item.children && item.children.length > 0) {
//         find = findMenu(item.children, title)
//         if (find) {
//           break
//         }
//       }
//     }
//   }
//   return find
// }

// export const findMenuByTitle = title => {
//   const menus = store.state.User.menus ?? []
//   const find = findMenu(menus, title)
//   return find
// }

