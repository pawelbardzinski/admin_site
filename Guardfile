# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard :jasmine do
  watch(%r{^spec/javascripts/.*(?:_s|S)pec\.(coffee|js)$})
  watch(%r{app/assets/javascripts/(.+?)\.(js\.coffee|js|coffee)(?:\.\w+)*$}) do |m|
    "spec/javascripts/jasmine/#{ m[1] }_spec.#{ m[2] }"
  end
end
