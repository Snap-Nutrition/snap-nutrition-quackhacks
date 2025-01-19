import base64
from io import BytesIO
import json
from openai import OpenAI
from pydantic import BaseModel
# https://platform.openai.com/docs/quickstart#create-and-export-an-api-key

client = OpenAI(
    api_key=""
)

class nutrients(BaseModel):
    meal_title: str
    calories: int
    protein: int
    carbs: int
    fat: int
    def toJSON(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__, 
            sort_keys=True,
            indent=4)

def get_macros(image):
    # https://platform.openai.com/docs/guides/vision
    open = BytesIO()
    image.save(open)

    value = base64.b64encode(open.getvalue()).decode("utf-8")

    request = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "You are a food and nutrition expert capable of analyzing meals from images. Your task is to estimate the macronutrients (calories, protein, carbohydrates, and fats) of a meal with given serving size based on a given picture. Consider the following guidelines for accuracy: Identify Food Components: Break down the meal into its individual ingredients (e.g., chicken breast, steamed broccoli, brown rice). Provide a brief list of the items visible in the image. Estimate Serving Sizes: Use the visual cues in the image to estimate the approximate serving size (in grams, cups, or other common units) for each ingredient. If specific serving sizes are provided, base your calculations on them. Provide Macronutrient Breakdown: Using a reliable nutritional database (e.g., USDA Food Composition Database), calculate: Calories (kcal) Protein (g) Carbohydrates (g) Fats (g) Assumptions: Make reasonable assumptions about cooking methods (e.g., grilled, boiled, fried) and seasoning if not explicitly stated.",
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{value}", "detail": "low",},
                    },
                ],
            }
        ],
    response_format=nutrients,
    )
    print(request.choices[0].message.parsed)
    return request.choices[0].message.parsed