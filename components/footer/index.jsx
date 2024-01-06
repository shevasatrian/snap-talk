// import styles from './styles.module.css';

import Link from "next/link";

export default function Footer() {
  return (
    <>
      <div className="py-1 px-2 text-sm text-gray-600">
        Copyright, Created by
      </div>
      <div className="px-2 text-sm text-gray-600">
        <Link href="instagram.com/sheva_str" className="text-cyan-500 font-semibold hover:text-cyan-400">@ShevaSatrian</Link> using Next JS
      </div>
    </>
    
  ) 
}