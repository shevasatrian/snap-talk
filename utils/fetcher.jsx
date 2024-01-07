/* eslint-disable linebreak-style */
/* eslint-disable arrow-parens */
/* eslint-disable eol-last */
/* eslint-disable semi */
const fetcher = (...args) => fetch(...args).then(res => res.json())
export default fetcher