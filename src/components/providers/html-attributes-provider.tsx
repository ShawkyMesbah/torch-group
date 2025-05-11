"use client"

import { useEffect } from "react"

export function HtmlAttributesProvider() {
  useEffect(() => {
    try {
      // Remove any data attributes that cause hydration errors
      const htmlElement = document.documentElement
      const attributesToRemove = [
        "data-bybit-channel-name",
        "data-bybit-is-default-wallet"
      ]
      
      // Function to remove attributes
      const removeAttributes = () => {
        attributesToRemove.forEach(attr => {
          if (htmlElement.hasAttribute(attr)) {
            htmlElement.removeAttribute(attr)
          }
        })
      }
      
      // Remove attributes immediately
      removeAttributes()
      
      // Create a MutationObserver to continuously remove these attributes
      // This handles cases where the extension re-adds them after our initial cleanup
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && 
              attributesToRemove.includes(mutation.attributeName || '')) {
            htmlElement.removeAttribute(mutation.attributeName || '')
          }
        })
      })
      
      // Start observing the HTML element for attribute changes
      observer.observe(htmlElement, { attributes: true })
      
      // Clean up on component unmount
      return () => {
        observer.disconnect()
      }
    } catch (error) {
      console.error('Error in HtmlAttributesProvider:', error)
    }
  }, [])
  
  return null
} 