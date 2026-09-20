import { GoogleGenAI, Type } from "@google/genai";
import { Analysis } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const healthAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        isHealthy: {
            type: Type.BOOLEAN,
            description: "Is the plant generally healthy?"
        },
        summary: {
            type: Type.STRING,
            description: "A concise, one-paragraph summary of the overall findings and key recommendations."
        },
        yieldImpact: {
            type: Type.STRING,
            description: "An estimation of the potential impact on crop yield if left untreated (e.g., 'Low', 'Moderate', 'High', 'Up to 20% loss'). Provide 'None' if healthy."
        },
        findings: {
            type: Type.ARRAY,
            description: "A list of all detected issues. This can be empty if the plant is healthy.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        enum: ['Disease', 'Pest', 'Nutrient Deficiency', 'Other'],
                        description: "The category of the finding."
                    },
                    name: {
                        type: Type.STRING,
                        description: "The common name of the issue (e.g., 'Septoria Leaf Spot', 'Aphids', 'Nitrogen Deficiency')."
                    },
                    severity: {
                        type: Type.STRING,
                        enum: ['Low', 'Medium', 'High', 'Critical'],
                        description: "The severity level of this specific issue."
                    },
                    confidence: {
                        type: Type.STRING,
                        enum: ['High', 'Medium', 'Low'],
                        description: "The confidence level of the diagnosis for this issue."
                    },
                    description: {
                        type: Type.STRING,
                        description: "A brief description of this specific issue, its symptoms, and impact."
                    },
                    treatment: {
                        type: Type.OBJECT,
                        properties: {
                            chemical: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 2-3 specific chemical treatments." },
                            organic: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 2-3 organic or cultural treatments." }
                        },
                        description: "Recommendations for treating the detected issue. Provide empty arrays if not applicable."
                    },
                    prevention: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "List of 2-3 actionable preventative measures."
                    }
                },
                required: ["type", "name", "severity", "confidence", "description", "treatment", "prevention"]
            }
        }
    },
    required: ["isHealthy", "summary", "yieldImpact", "findings"]
};


export const getPlantHealthAnalysis = async (base64Image: string, mimeType: string, context?: { cropType?: string }): Promise<Analysis> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };

        const contextText = context?.cropType ? ` The plant is a ${context.cropType}.` : '';
        const textPart = {
            text: `You are an expert agricultural scientist specializing in plant pathology. Analyze the provided image of a plant leaf.${contextText} Identify all potential diseases, pests, and nutrient deficiencies. Provide a detailed, multi-label analysis in JSON format based on the schema. If multiple issues are present, list them all in the findings array. Ensure your treatment and prevention advice is practical for a small-scale farmer.`,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: healthAnalysisSchema,
            },
        });
        
        // FIX: Removed .trim() as it was causing an error. The response.text property is a direct string.
        const jsonText = response.text;
        const parsedJson = JSON.parse(jsonText);

        return parsedJson as Analysis;

    } catch (error) {
        console.error("Error analyzing image with Gemini API:", error);
        if (error instanceof Error) {
            throw error; // Re-throw the original error to be handled by the caller
        }
        throw new Error("Failed to get analysis from AI. Please check the image or try again.");
    }
};