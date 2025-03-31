import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-gray-600 mb-8">
        Find answers to common questions about legal procedures and using NyayaSetu.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">About Legal Processes</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What should I do if I've been arrested?</AccordionTrigger>
              <AccordionContent>
                <p>If you are arrested in India, you have the following rights:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Right to know the grounds of arrest</li>
                  <li>Right to inform a friend, relative or person of interest about your arrest</li>
                  <li>Right to meet an advocate of your choice</li>
                  <li>Right to be produced before a magistrate within 24 hours</li>
                  <li>Right to a medical examination</li>
                  <li>Right not to be subjected to unnecessary restraint or torture</li>
                </ul>
                <p className="mt-2">
                  It's advisable to remain calm, cooperate with the police, and seek legal counsel immediately.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do I file for divorce in India?</AccordionTrigger>
              <AccordionContent>
                <p>To file for divorce in India, follow these general steps:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Determine the grounds for divorce (mutual consent, cruelty, desertion, etc.)</li>
                  <li>File a petition in the family court having jurisdiction</li>
                  <li>Attempt reconciliation if ordered by the court</li>
                  <li>Go through trial proceedings if it's a contested divorce</li>
                  <li>Wait for the court's decree (typically 6-18 months)</li>
                </ul>
                <p className="mt-2">
                  The process varies based on personal laws (Hindu, Muslim, Christian, Parsi, etc.).
                  It's advisable to consult with a family law advocate.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What is the process for property registration?</AccordionTrigger>
              <AccordionContent>
                <p>For property registration in India, follow these steps:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Execute a sale deed or transfer document</li>
                  <li>Pay appropriate stamp duty as per state laws</li>
                  <li>Get the deed registered at the Sub-Registrar's office within 4 months</li>
                  <li>Pay registration fee (typically 1% of property value)</li>
                  <li>Get property mutation done in municipal records for tax purposes</li>
                </ul>
                <p className="mt-2">
                  The exact process and fees vary by state. Consider consulting a property law expert.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How can I file an FIR?</AccordionTrigger>
              <AccordionContent>
                <p>To file an FIR (First Information Report) in India:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Go to the police station that has jurisdiction over the area where the crime occurred</li>
                  <li>Provide all details of the incident to the officer in charge</li>
                  <li>Get a copy of the FIR with a unique number</li>
                  <li>If police refuse to register your FIR, you can approach the Superintendent of Police</li>
                  <li>You can also file a complaint before the Magistrate under Section 156(3) CrPC</li>
                </ul>
                <p className="mt-2">
                  An FIR should be filed as soon as possible after the incident for better investigation.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">About NyayaSetu</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-5">
              <AccordionTrigger>How does NyayaSetu work?</AccordionTrigger>
              <AccordionContent>
                <p>NyayaSetu works in 3 simple steps:</p>
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                  <li>Search for advocates based on location, specialization, and experience</li>
                  <li>Connect with an advocate by paying a small fee of ₹10</li>
                  <li>Consult with the advocate securely through our encrypted chat system</li>
                </ol>
                <p className="mt-2">
                  You can also use our AI legal assistant to get general information about Indian laws.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Are the advocates verified?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Yes, all advocates on NyayaSetu are verified professionals. We verify their:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Bar Council registration number</li>
                  <li>Identity and contact information</li>
                  <li>Professional qualifications</li>
                  <li>Practice experience</li>
                </ul>
                <p className="mt-2">
                  Advocates with a "Verified" badge have completed our verification process.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>How secure is the platform?</AccordionTrigger>
              <AccordionContent>
                <p>
                  NyayaSetu prioritizes your privacy and security:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>End-to-end encrypted communication between clients and advocates</li>
                  <li>Secure payment processing through Razorpay</li>
                  <li>No sharing of personal data with third parties</li>
                  <li>Strong data protection measures following industry standards</li>
                </ul>
                <p className="mt-2">
                  Your legal consultations and personal information remain confidential.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>What if I'm not satisfied with an advocate?</AccordionTrigger>
              <AccordionContent>
                <p>
                  If you're not satisfied with an advocate's services:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>You can provide feedback through our review system</li>
                  <li>Contact our support team at support@nyayasetu.com</li>
                  <li>Connect with a different advocate for a second opinion</li>
                </ul>
                <p className="mt-2">
                  While the initial connection fee is non-refundable, we strive to ensure
                  you receive quality legal assistance. We take feedback seriously to maintain
                  our platform's quality.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}